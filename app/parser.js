"use strict";
const assert = require("assert");
const recast = require("recast");
const pd = require("pretty-data").pd;

class Parser {
    constructor(code) {
        this.code = code;
        this.ast = recast.parse(code);
        this.lines = code.split("\n");
        this._assemble_stack();
        this._process_stack();
    }
    xml() {
        return this.out.join('')
    }
    _assemble_stack() {
        let stack = []
        recast.visit(this.ast, {
            visitNode: function(path) {
                if (path.node.loc === null) {
                    path.node.loc = stack[stack.length-1][0].loc
                }
                stack.push([path.node, true]);
                this.traverse(path);
                stack.push([path.node, false]);
            }
        });
        this.stack = stack;
    }
    _process_stack() {
        this.out = [];
        this.tree = { node: null, children: [], key: "1", id: 1};
        let nodeStack = [this.tree];
        for (var i = 0; i < this.stack.length; i++) {
            let node = this.stack[i][0];

            if (node.type == "File") {
                continue;
            }
            if (node.type == "Program") {
                continue;
            }

            let is_start = this.stack[i][1];
            if (is_start) {
                let id = nodeStack[nodeStack.length - 1].children.length + 1
                let new_key = nodeStack[nodeStack.length - 1].key + `-${id}`
                let new_body = { node: node.type, children: [], key: new_key, id: id};
                nodeStack[nodeStack.length - 1].children.push(new_body);
                nodeStack.push(new_body);
            } else {
                nodeStack.pop();
            }

            let next = this.stack[i + 1];
            let next_node;
            let next_start;
            if (next) {
                next_node = next[0];
                next_start = next[1];
            } else {
                next_node = { loc: { start: { column: 0 } } };
                next_start = true;
            }
            let end;
            if (next_start) {
                end = next_node.loc.start;
            } else {
                end = next_node.loc.end;
            }
            if (is_start) {
                this.out.push(`<${node.type}>`);
                let string = this._code_for_loc({
                    start: node.loc.start,
                    end: end
                });
                this.out.push(string);
                if (string.length) {
                    nodeStack[nodeStack.length - 1].children.push(string);
                }
            } else {
                this.out.push(`</${node.type}>`);
                let string = this._code_for_loc({
                    start: node.loc.end,
                    end: end
                });
                this.out.push(string);
                if (string.length) {
                    nodeStack[nodeStack.length - 1].children.push(string);
                }
            }
        }
    }
    _code_for_loc(loc) {
        let relevant_lines = this.lines.slice(loc.start.line - 1, loc.end.line);
        if (relevant_lines.length == 0) {
            return "";
        }
        // snip off unneeded ending text
        let lastLine = relevant_lines.length - 1;
        relevant_lines[lastLine] = relevant_lines[lastLine].substring(
            0,
            loc.end.column
        );

        // snip off unneeded beginning text
        relevant_lines[0] = relevant_lines[0].substring(
            loc.start.column,
            relevant_lines[0].length
        );
        return relevant_lines.join("\n");
    }
}

module.exports = Parser;
