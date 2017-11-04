const recast = require("recast");
const esprima = require('esprima')

const program = "const h = 'hi';()=>{console.log('foo')}"

const ast = recast.parse(program)
const output = recast.prettyPrint(ast).code;
console.log(output)

// const ast = esprima.parse(program, {sourceType: 'module', jsx: true})
// console.log(ast)
// console.log(prettier.__debug.formatAST(ast))


