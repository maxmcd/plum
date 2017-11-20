const recast = require("recast");
const util = require("./util");
let b = recast.types.builders;

let placeholder = b.identifier("TMP");

let identifierOrPlaceholder = function(str) {
    return str ? b.identifier(str) : placeholder;
};

let file = function(name) {
    return b.file(b.program([]), name || null);
};

let variableDeclaration = function({ kind, id, init }) {
    return b.variableDeclaration(kind || "let", [
        b.variableDeclarator(b.identifier(id), init || null),
    ]);
};

let forInStatement = function({ left, right }) {
    return b.forInStatement(
        b.variableDeclaration("let", [
            b.variableDeclarator(identifierOrPlaceholder(left), null),
        ]),
        identifierOrPlaceholder(right),
        b.blockStatement([]),
    );
};

let binaryExpression = function({ sign, right, left }) {
    return b.binaryExpression(
        sign,
        identifierOrPlaceholder(left),
        identifierOrPlaceholder(right),
    );
};

let expressionStatement = function({ sign, left, right }) {
    return b.expressionStatement(
        b.assignmentExpression(
            sign,
            identifierOrPlaceholder(left),
            identifierOrPlaceholder(right),
        ),
    );
};

let memberExpression = function({ left, right }) {
    return b.memberExpression(
        identifierOrPlaceholder(left),
        identifierOrPlaceholder(right),
        true,
    );
};

let identifier = function(name) {
    return b.identifier(name);
};

let literal = function(value) {
    return b.literal(value);
};

module.exports = {
    expressionStatement: expressionStatement,
    binaryExpression: binaryExpression,
    file: file,
    forInStatement: forInStatement,
    identifier: identifier,
    literal: literal,
    variableDeclaration: variableDeclaration,
    memberExpression: memberExpression,
};
