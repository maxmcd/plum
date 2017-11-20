/*

Build a basic but important script with just ast transformations.

Let's build this script:

var description = "";
var person = {fname:"Paul", lname:"Ken", age:18};
for (var x in person){
    description += person[x] + " ";
}

Taken from here: https://learnxinyminutes.com/docs/javascript/
Should work well enough.

*/

const recast = require("recast");
const util = require("../util");
let b = recast.types.builders;

let path;
let program = "'hi'";
program = "for (var x in y){}";
let ast = recast.parse(program);
recast.visit(ast, {
    visitNode: function(_path) {
        path = _path;
        return false;
    },
});

// The ast is formatted like so
// <File><Program></Program></File>
// If we grab the file value we get the program
path = path.get("program");

let variableDeclaration = function({ kind, id, init }) {
    return b.variableDeclaration(kind || "var", [
        b.variableDeclarator(b.identifier(id), init || null),
    ]);
};

module.exports = {
    variableDeclaration: variableDeclaration,
};

// b.objectExpression([
//     b.property("init", b.identifier("fname"), b.literal("Paul")),
//     b.property("init", b.identifier("lname"), b.literal("Ken")),
//     b.property("init", b.identifier("age"), b.literal(18))
// ])

// util.keys(b)
let varDec = b.variableDeclaration("var", [
    b.variableDeclarator(b.identifier("description"), b.identifier('""')),
]);

console.log(recast.print(varDec).code);

let objDec = b.variableDeclaration("var", [
    b.variableDeclarator(
        b.identifier("person"),
        b.objectExpression([
            b.property("init", b.identifier("fname"), b.literal("Paul")),
            b.property("init", b.identifier("lname"), b.literal("Ken")),
            b.property("init", b.identifier("age"), b.literal(18)),
        ]),
    ),
]);

let concat = b.expressionStatement(
    b.assignmentExpression(
        "+=",
        b.identifier("description"),
        b.binaryExpression(
            "+",
            b.memberExpression(b.identifier("person"), b.identifier("x"), true),
            b.literal(" "),
        ),
    ),
);

let forLoop = b.forInStatement(
    b.variableDeclaration("var", [
        b.variableDeclarator(b.identifier("x"), null),
    ]),
    b.identifier("person"),
    b.blockStatement([concat]),
);

path.get("body").push(varDec);
path.get("body").push(objDec);
path.get("body").push(forLoop);

console.log(recast.print(ast).code);
