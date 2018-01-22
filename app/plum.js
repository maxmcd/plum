const types = require("ast-types");
class Node {
  constructor(node) {
    this.def = types.getDef(node);
    this.fields = {};
    this.node = node
    for (let x in this.def.allFields) {
      let field = this.def.allFields[x];
      if (field.hidden === false) {
        this.fields[x] = new Field(field, x, this);
      }
    }
  }
}

class Field {
  constructor(field, name, node) {
    this.field = field;
    this.name = name;
    this.node = node;
  }
  options() {
    if (typeof this.field.type.name == "string") {
      return this.field.type.name;
    } else {
      return this.field.type.name();
    }
  }
  displayValue() {
    let value = this.node.node[this.name]
    if (typeof value == "string") {
      return value
    } else if (Array.isArray(value)) {
      let children = value.map(node => node.type)
      return JSON.stringify(children)
    } else if (value) {
      return value.constructor.name
    } else {
      return JSON.stringify(value)
    }
  }
}

module.exports = {
  Node: Node,
};
