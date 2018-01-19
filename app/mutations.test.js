"use strict";
const recast = require("recast");
const m = require("./mutations");
const util = require("./util");
let b = recast.types.builders;

let print = function(ast) {
    return recast.print(ast).code;
};

it("can build a basic script", () => {
    /*
    let description = "";

    let person = {
        fname: "Paul",
        lname: "Ken",
        age: 18
    };

    for (let x in person) {
        description += person[x] + " ";
    }
    */
    let placeholder = b.identifier("TMP");

    let file = m.file();
    expect(print(file)).toEqual("");

    let varDec = m.variableDeclaration({ id: "description" });
    m.addToNode(file.program.body, varDec);

    expect(print(file)).toEqual("let description;");

    varDec.declarations[0].init = m.literal("");
    expect(print(file)).toEqual('let description = "";');

    let person = m.variableDeclaration({ id: "person" });

    let data = b.objectExpression([]);

    // simple replace
    person.declarations[0].init = data;

    expect(print(person)).toEqual("let person = {};");

    m.addToNode(
        data.properties,
        b.property("init", b.identifier("fname"), placeholder),
    );
    // simple replace
    data.properties[0].value = b.literal("Paul");

    expect(print(person)).toEqual(`let person = {\n    fname: "Paul"\n};`);

    data.properties.push(
        b.property("init", b.identifier("lname"), placeholder),
    );
    data.properties[1].value = b.literal("Ken");

    data.properties.push(b.property("init", b.identifier("age"), placeholder));
    data.properties[2].value = b.literal(18);

    expect(print(person)).toEqual(
        'let person = {\n    fname: "Paul",\n    lname: "Ken",\n    age: 18\n};',
    );

    file.program.body.push(person);

    let forStatement = m.forInStatement({ left: "x", right: "person" });
    file.program.body.push(forStatement);

    expect(print(forStatement)).toEqual("for (let x in person)\n    {}");

    let exp = m.expressionStatement({ sign: "+=", left: "description" });
    expect(print(exp)).toEqual("description += TMP;");

    forStatement.body.body.push(exp);

    let binaryExp = m.binaryExpression({ sign: "+" });
    exp.expression.right = binaryExp;

    expect(print(exp)).toEqual("description += TMP + TMP;");

    binaryExp.right = m.literal(" ");

    expect(print(exp)).toEqual('description += TMP + " ";');

    binaryExp.left = m.memberExpression({ left: "person", right: "x" });

    expect(print(exp)).toEqual('description += person[x] + " ";');

    expect(print(file)).toEqual(
        `let description = "";

let person = {
    fname: "Paul",
    lname: "Ken",
    age: 18
};

for (let x in person) {
    description += person[x] + " ";
}`,
    );
});

it("can build a basic react script", () => {
    /* 
    class HelloMessage extends React.Component {
      render() {
        return (
          <div>
            Hello {this.props.name}
          </div>
        );
      }
    }
    */
    let placeholder = b.identifier("TMP");

    let file = m.file();
    expect(print(file)).toEqual("");

    let classDec = m.classDeclaration({
        name: "HelloMessage",
        superClass: "React.Component",
    });
    m.addToNode(file.program.body, classDec);
    expect(print(file)).toEqual(
        "class HelloMessage extends React.Component {}",
    );
    m.addClassMethod(classDec, "render");
    expect(print(file)).toEqual(
        "class HelloMessage extends React.Component {\n    render() {}\n}",
    );
    let returnStatement = m.returnStatement();
    m.addToNode(classDec.body.body[0].body.body, returnStatement);
    expect(print(file)).toEqual(
        "class HelloMessage extends React.Component " +
            "{\n    render() {\n        return TMP;\n    }\n}",
    );

    returnStatement.argument = b.jsxElement(
        b.jsxOpeningElement(b.jsxIdentifier("div")),
        b.jsxClosingElement(b.jsxIdentifier("div")),
    );
    // expect(print(file)).toEqual();
});

it("trimAndReturnParts should return correct parts", () => {});
