"use strict";
const Parser = require("./parser");

let variable_declaration = `let i = "i";`;
let fat_arrow_declaration = `let foo = () => {
    console.log("thing")
}`;

it("constructs class correctly", () => {
    let parser = new Parser(variable_declaration);
    expect(parser.code).toEqual(variable_declaration);
});

it("constructs basic tree and xml", () => {
    let parser = new Parser(variable_declaration);
    let expected_tree = {
        node: null,
        children: [
            {
                node: "VariableDeclaration",
                children: [
                    "let ",
                    {
                        node: "VariableDeclarator",
                        children: [
                            {
                                node: "Identifier",
                                children: ["i"]
                            },
                            " = ",
                            {
                                node: "Literal",
                                children: ['"i"']
                            }
                        ]
                    },
                    ";"
                ]
            }
        ]
    };
    let expected_xml =
        `<VariableDeclaration>let <VariableDeclarator>` +
        `<Identifier>i</Identifier> = <Literal>"i"` +
        `</Literal></VariableDeclarator>;</VariableDeclaration>`;
    expect(parser.tree).toMatchObject(expected_tree);
    expect(parser.xml()).toEqual(expected_xml);
});

it("constructs multiline tree and xml", () => {
    let parser = new Parser(
        [variable_declaration, fat_arrow_declaration].join("\n")
    );
    let expected_tree = {
        node: null,
        children: [
            {
                node: "VariableDeclaration",
                children: [
                    "let ",
                    {
                        node: "VariableDeclarator",
                        children: [
                            { node: "Identifier", children: ["i"] },
                            " = ",
                            { node: "Literal", children: ['"i"'] }
                        ]
                    },
                    ";"
                ]
            },
            "\n",
            {
                node: "VariableDeclaration",
                children: [
                    "let ",
                    {
                        node: "VariableDeclarator",
                        children: [
                            { node: "Identifier", children: ["foo"] },
                            " = ",
                            {
                                node: "ArrowFunctionExpression",
                                children: [
                                    "() => ",
                                    {
                                        node: "BlockStatement",
                                        children: [
                                            "{\n    ",
                                            {
                                                node: "ExpressionStatement",
                                                children: [
                                                    {
                                                        node: "CallExpression",
                                                        children: [
                                                            {
                                                                node: "MemberExpression",
                                                                children: [
                                                                    {
                                                                        node: "Identifier",
                                                                        children: [
                                                                            "console"
                                                                        ]
                                                                    },
                                                                    ".",
                                                                    {
                                                                        node: "Identifier",
                                                                        children: [
                                                                            "log"
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            "(",
                                                            {
                                                                node: "Literal",
                                                                children: [
                                                                    '"thing"'
                                                                ]
                                                            },
                                                            ")"
                                                        ]
                                                    }
                                                ]
                                            },
                                            "\n}"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    let expected_xml =
        `<VariableDeclaration>let <VariableDeclarator><Identifier>i` +
        `</Identifier> = <Literal>\"i\"</Literal></VariableDeclarator>` +
        `;</VariableDeclaration>\n<VariableDeclaration>let ` +
        `<VariableDeclarator><Identifier>foo</Identifier> = ` +
        `<ArrowFunctionExpression>() => <BlockStatement>{\n    ` +
        `<ExpressionStatement><CallExpression><MemberExpression><Identifier>` +
        `console</Identifier>.<Identifier>log</Identifier></MemberExpression>` +
        `(<Literal>\"thing\"</Literal>)</CallExpression></ExpressionStatement>` +
        `\n}</BlockStatement></ArrowFunctionExpression></VariableDeclarator>` +
        `</VariableDeclaration>`;
    expect(parser.tree).toMatchObject(expected_tree);
    expect(parser.xml()).toEqual(expected_xml);
});
