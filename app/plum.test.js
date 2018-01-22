const plum = require("./plum");
const util = require("./util");
const recast = require("recast");

it("can get basic node info", () => {
  let program = `let foo = () => {
      console.log("thing")\n}`;
  expect(true).toEqual(true);

  let ast = util.parse(program);

  let varDec = ast.program.body[0];

  let node = new plum.Node(varDec);
  // console.log(node.fields);

  for (let x in node.fields) {
    console.log(
      node.fields[x].name,
      node.fields[x].options(),
      node.fields[x].displayValue()
    );
  }
});
