const types = require("ast-types");
class Node {
  constructor(node) {
    this.def = types.getDef(node);
    this.fields = {};
    for (let x in this.def.allFields) {
      let field = this.def.allFields[x];
      if (field.hidden === false) {
        this.fields[x] = new Field(field, x);
      }
    }
  }
}

class Field {
  constructor(field, name) {
    this.field = field;
    this.name = name;
  }
  options() {
    if (typeof this.field.type.name == "string") {
      return this.field.type.name;
    } else {
      return this.field.type.name();
    }
  }
}

module.exports = {
  Node: Node
};
