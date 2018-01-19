import React from "react";
import Expo from "expo";
import {
  StyleSheet,
  Text,
  View,
  AlertIOS,
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
      modalVisible: false,
      selectedNode: null
    };
    Expo.FileSystem
      .readDirectoryAsync(Expo.FileSystem.documentDirectory)
      .then(files => {
        console.log(files);
      });

    Expo.FileSystem
      .readAsStringAsync(Expo.FileSystem.documentDirectory + "App.js")
      .then(body => {
        if (body) {
          let ast = util.parse(body);
          this.setState({
            ast: ast,
            program: body
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  _downloadApp() {
    Expo.FileSystem
      .downloadAsync(
        "http://localhost:7654/App.js",
        `${Expo.FileSystem.documentDirectory}App.js`
      )
      .then(({ uri }) => {
        console.log(uri);
        return uri;
      });
  }
  renderText(err, data) {
    if (err) {
      return console.log(err);
    }
    this.setState({ code: data });
  }
  getTextAtLocation(location) {
    this.state.text[location];
  }
  displayType(type) {
    AlertIOS.alert(type);
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

    if (lastMatch.node.type == "Identifier") {
      // lastMatch.name = "whatever_very_long_very_long"
      lastMatch.node;
      console.log(lastMatch.parentPath.node.type);
      // console.log(lastMatch.parentPath.node.object.name)
      // console.log(lastMatch.parentPath.node.property.name)
      this.rerender();
    }

    this.setState({
      modalVisible: true,
      selectedNode: lastMatch
    });
  }
  rerender() {
    let program = util.printAst(this.state.ast);
    this.setState({
      ast: util.parse(program),
      program: program
    });
  }
  onClickToken({ loc, node }) {
    this._getNodeForLoc(loc);
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
      if (node[key] && Array.isArray(node[key])) {
        for (let index in node[key]) {
          console.log(index);
          let path = this.state.selectedNode.get(key).get(index);
          out.push(
            <View key={key}>
              <View style={{ flexDirection: "row" }}>
                <Link
                  onPress={() => {
                    this.setState({ selectedNode: path });
                  }}
                >
                  {key}: {path.node.type}
                </Link>
              </View>
            </View>
          );
        }
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
    if (!this.state.selectedNode) {
      return;
    }
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
