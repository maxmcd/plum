require('colors')
const assert = require("assert");
const recast = require("recast");

const program = "const h = 'hi';()=>{console.log('foo')}";

let formatted_program = `const h = "hi";
() => {
    console.log("foo");
};`;

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
let out = ""
let code_for_loc = (loc, color) => {
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


let cursor = {
    line: 0,
    column: 0,
    node: {type: "none", color: "black"},
}
let stack = []
recast.visit(ast, {
    visitNode: function(path) {
        let color = colors[Math.floor(Math.random()*colors.length)];

        path.node.color = color

        new_cursor = {
            line: path.node.loc.start.line,
            column: path.node.loc.start.column,
            node: path.node
        }
        process.stdout.write(path.node.type[color] + " \n")
        process.stdout.write(code_for_loc(path.node.loc)[color])
        process.stdout.write("\n")
        stack.push(path.node)
        // process.stdout.write(` str ${cursor.node.type} `[cursor.node.color])
        // code_for_loc({start: cursor, end: new_cursor}, cursor.node.color)
        cursor = new_cursor

        this.traverse(path);

        process.stdout.write(path.node.type[color] + " \n")
        process.stdout.write(code_for_loc(path.node.loc)[color])
        process.stdout.write("\n")

        let child = stack.pop()
        // console.log(child.type, path.node.type)
        new_cursor = {
            line: path.node.loc.end.line,
            column: path.node.loc.end.column,
            node: path.node
        }
        // code_for_loc({start: cursor, end: new_cursor}, color)
        // process.stdout.write(` end ${new_cursor.node.type} `[color])
        cursor = new_cursor
    }
});

console.log(out)
let printLevel = function() {};
// console.log(ast);
// console.log(JSON.stringify(ast, null, 4));

// const output = recast.prettyPrint(ast).code;
// console.log(output)
