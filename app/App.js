import React from "react";
import Expo from "expo";
import { StyleSheet, Text, View, AlertIOS } from "react-native";
const recast = require("recast");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderBody = this.renderBody.bind(this);

    this.state = {
      text: "",
      ast: null,
      tree: {"node":null,"children":[{"node":"VariableDeclaration","children":["let ",{"node":"VariableDeclarator","children":[{"node":"Identifier","children":["thing"]}," = ",{"node":"ArrowFunctionExpression","children":["() => ",{"node":"BlockStatement","children":["{\n    ",{"node":"ExpressionStatement","children":[{"node":"CallExpression","children":[{"node":"MemberExpression","children":[{"node":"Identifier","children":["console"]},".",{"node":"Identifier","children":["log"]}]},"(",{"node":"Literal","children":["\"hi\""]},")"]}]},"\n}"]}]}]}]}]}
    };
    Expo.FileSystem
      .downloadAsync(
        "http://localhost:7654/App.js",
        `${Expo.FileSystem.documentDirectory}App.js`
      )
      .then(({ uri }) => {
        console.log(uri);
        return uri;
      })
      .then(Expo.FileSystem.readAsStringAsync)
      .then(body => {
        const ast = recast.parse(body);
        const output = recast.prettyPrint(ast).code;
        this.setState({
          text: output.split("\n"),
          ast: ast
        });
      })
      .catch(err => {
        console.log(err);
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
  renderBody(element) {
    if (typeof element === 'object') {
      return (<Text onPress={() => {this.displayType(element.node)}}>
        {element.children.map(this.renderBody)}</Text>)
    } else {
      return element
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.tree.children.map(this.renderBody)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
