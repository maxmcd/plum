/*

Experiment with ways to get more detailed information about nodes
Especially related to the ast-types library lanaguage definitions

This information can be retrieved from the ast. ast-types should provide
information about valid values and defaults.

*/

const util = require("../util");
const recast = require("recast");
const types = require("../../../ast-types/main");

let program = `let foo = () => {
    console.log("thing")\n}`;

let ast = util.parse(program);

let varDec = ast.program.body[0];

/*
from core.js in ast-types

def("VariableDeclaration")
    .bases("Declaration")
    .build("kind", "declarations")
    .field("kind", or("var", "let", "const"))
    .field("declarations", [def("VariableDeclarator")]);

def("VariableDeclarator")
    .bases("Node")
    .build("id", "init")
    .field("id", def("Pattern"))
    .field("init", or(def("Expression"), null));

*/

let def = types.getDef(varDec);

def.allFields;
/*
Makes sense
{ loc: Field {},
  type: Field {},
  comments: Field {},
  kind: Field {},
  declarations: Field {} }
*/

def.allFields.kind.getValue(varDec);
// let
/*
Seems there is not way to get the options here: or("var", "let", "const")
That's important for us
*/

for (let x in def.allFields) {
  if (def.allFields[x].hidden === false) console.log(x);
}
/*
type
kind
declarations
*/

/*
Ah, there we go

> def.allFields.kind.type.name()
'var | let | const'
> def.allFields.kind.type.check()
false
> def.allFields.kind.type.check('let')
true

*/
