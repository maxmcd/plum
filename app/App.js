import React from "react";
import Expo from "expo";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback
} from "react-native";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { darcula } from "react-syntax-highlighter-prismjs/dist/styles";

import util from "./util";
import plum from "./plum";

const recast = require("recast");
const types = require("ast-types");

class Link extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <Text style={{ textDecorationLine: "underline" }}>
          {this.props.children}
        </Text>
      </TouchableHighlight>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this._getNodeForLoc = this._getNodeForLoc.bind(this);
    this._renderNodeChildrenButtons = this._renderNodeChildrenButtons.bind(
      this
    );
    this._renderModalBody = this._renderModalBody.bind(this);
    this.onClickToken = this.onClickToken.bind(this);

    this.program = `let foo = () => {
    console.log("thing")\n}`;
    this.ast = util.parse(this.program);
    this.state = {
      program: this.program,
      ast: this.ast,
      selectedNode: this._getNodeForLoc({
        start: {
          column: 0,
          line: 0
        },
        end: {
          column: 0,
          line: 0
        }
      })
    };
  }
  getTextAtLocation(location) {
    this.state.text[location];
  }
  _getNodeForLoc(loc) {
    let lastMatch;

    util.timeIt(
      () => {
        recast.visit(this.state.ast, {
          visitNode: function(path) {
            if (!path.node.loc) {
              this.traverse(path);
            } else if (util.isWithinLoc(path.node.loc, loc)) {
              lastMatch = path;
              this.traverse(path);
            } else {
              return false;
            }
          }
        });
      },
      "AST node search",
      5
    );
    return lastMatch;
  }
  rerender() {
    let program = util.printAst(this.state.ast);
    this.setState({
      ast: util.parse(program),
      program: program
    });
  }
  onClickToken({ loc, node }) {
    this.setState({
      selectedNode: this._getNodeForLoc(loc)
    });
  }
  _renderNodeChildrenButtons() {
    let out = [];
    let node = this.state.selectedNode.node;
    // console.log(types.getFieldNames(node))
    // console.log(
    //   types.getFieldNames(node).map(name => types.getFieldValue(node, name))
    // );
    let n = new plum.Node(node);
    console.log("---");
    for (let x in n.fields) {
      console.log(n.fields[x].name, n.fields[x].options());
    }
    console.log("---");

    for (let key in node) {
      if (node[key] && node[key].type) {
        let path = this.state.selectedNode.get(key);
        out.push(
          <View key={key}>
            <Link
              onPress={() => {
                this.setState({ selectedNode: path });
              }}
            >
              {key}: {path.node.type}
            </Link>
          </View>
        );
      }
    }
    if (out.length > 0) {
      out.unshift(
        <View key="title-thing">
          <Text style={{ fontWeight: "bold" }}>Children:</Text>
        </View>
      );
    }
    return out;
  }
  _renderModalBody() {
    let parentPath = this.state.selectedNode.parent;
    return (
      <View style={{ backgroundColor: "white" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Parent:</Text>
          <Link
            onPress={() => {
              this.setState({
                selectedNode: parentPath
              });
              this.rerender();
            }}
          >
            ({parentPath.node.type})
          </Link>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Current Node: </Text>
          <Text>{this.state.selectedNode.node.type}</Text>
        </View>
        <View>
          {this._renderNodeChildrenButtons()}
        </View>
      </View>
    );
  }
  render() {
    if (this.state.selectedNode) {
      console.log(
        this.state.selectedNode.name +
          " - " +
          this.state.selectedNode.parentPath.name
      );
    }

    return (
      <View
        style={{
          backgroundColor: darcula.hljs.backgroundColor,
          height: "100%"
        }}
      >
        <View style={{ height: 20 }} />
        <SyntaxHighlighter
          language="javascript"
          style={darcula}
          onClickToken={this.onClickToken}
          selectedNode={this.state.selectedNode}
        >
          {this.state.program}
        </SyntaxHighlighter>
        {this._renderModalBody()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333"
  }
});
