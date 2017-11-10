"use strict";
require("colors");
const assert = require("assert");
const recast = require("recast");
const pd = require("pretty-data").pd;

const jsx = false;

const program = "const i = 'yo';";

let formatted_program = `const i = 'yo';`
formatted_program = `let thing = () => {
    console.log("hi")
}`;
// formatted_program = `const hi = "hi";`

const colors = [
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "gray"
];

const ast = recast.parse(formatted_program);

let lines = formatted_program.split("\n");

let code_for_loc = loc => {
    let relevant_lines = lines.slice(loc.start.line - 1, loc.end.line);

    if (relevant_lines.length == 0) {
        return;
    }
    let lastIndex = relevant_lines.length - 1;
    relevant_lines[lastIndex] = relevant_lines[lastIndex].substring(
        0,
        loc.end.column
    );

    relevant_lines[0] = relevant_lines[0].substring(
        loc.start.column,
        relevant_lines[0].length
    );
    return relevant_lines.join("\n");
};

let stack = [];
recast.visit(ast, {
    visitNode: function(path) {
        stack.push([path.node, true]);
        this.traverse(path);
        stack.push([path.node, false]);
    }
});

let out = [];
let tree = [
    { VariableDeclaration: [
        "const ", 
        { VariableDeclarator: [
            { Identifier: [] }, 
            " = ",
            { Literal: [] },
        ] }
    ] }
];
tree = {node: null, children: []}
let node = null;
let nodeStack = [tree];
for (var i = 0; i < stack.length; i++) {

    let node = stack[i][0];
    if (node.type == "File") {
        continue;
    }
    if (node.type == "Program") {
        continue;
    }

    let is_start = stack[i][1];
    if (is_start) {
        let new_body = {node: node.type, children: []}
        nodeStack[nodeStack.length-1].children.push(new_body)
        nodeStack.push(new_body)
    } else {
        nodeStack.pop()
    }
    let next = stack[i + 1];

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
        if (jsx) {
            out.push(
                `<Text onPress={() => {this.displayType("${node.type}")}}>`
            );
            out.push(
                `{${JSON.stringify(code_for_loc({
                        start: node.loc.start,
                        end: end
                    }))}}`
            );
        } else {
            out.push(`<${node.type}>`);
            let string = code_for_loc({ start: node.loc.start, end: end })
            out.push(string);
            if (string.length) {
                nodeStack[nodeStack.length-1].children.push(string)    
            }
        }
    } else {
        if (jsx) {
            out.push(`</Text >`);
            out.push(
                `{${JSON.stringify(code_for_loc({
                        start: node.loc.end,
                        end: end
                    }))}}`
            );
        } else {
            out.push(`</${node.type}>`);
            let string = code_for_loc({ start: node.loc.end, end: end })
            out.push(string);
            if (string.length) {
                nodeStack[nodeStack.length-1].children.push(string)
            }
        }
    }
}
let out_string = out.join("");
console.log(pd.xml(out_string));
console.log(JSON.stringify(nodeStack[0]))

