const util = require("../util")
const recast = require("recast");
const types = require("../../../ast-types/main")

let program = `let foo = () => {
    console.log("thing")\n}`;

this.ast = util.parse(this.program);