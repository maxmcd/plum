require('colors')
const assert = require("assert");
const recast = require("recast");

const program = "const h = 'hi';()=>{console.log('foo')}";

let formatted_program = `const h = "hi";
() => {
    console.log("foo");
};`;
// formatted_program = `const hi = "hi";`

const colors = [
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "gray",
]

const ast = recast.parse(formatted_program);

let lines = formatted_program.split("\n");

let code_for_loc = (loc) => {
    let relevant_lines = lines.slice(loc.start.line - 1, loc.end.line);

    if (relevant_lines.length == 0) {
        return
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
    return relevant_lines.join('\n')
};

let stack = []
recast.visit(ast, {
    visitNode: function(path) {
        stack.push([path.node, true])
        this.traverse(path);
        stack.push([path.node, false])
    }
});

let out = []
for (var i=stack.length-1; i > -1; i--) {
    
    let node = stack[i][0]
    let is_start = stack[i][1]
    let next = stack[i-1]

    let next_node;
    let next_start;
    if (next) {
        next_node = next[0]
        next_start = next[1]
    } else {
        next_node = {loc: {start: {column: 0}}}
        next_start = true
    }

    let end
    if (next_start) {
        end = next_node.loc.start
    } else {
        end = next_node.loc.end
    }
    if (is_start) {
        out.push(`<Text onPress={() => {this.displayType("${node.type}")}}>`)
        out.push(`{${JSON.stringify(code_for_loc({end: node.loc.start, start: end}))}}`)
    } else {
        out.push(`</Text >`)
        out.push(`{${JSON.stringify(code_for_loc({end: node.loc.end, start: end}))}}`)
    }
}


out.reverse()
let out_string = out.join('')
out_string = out_string
out_string = out_string
console.log(out_string)
