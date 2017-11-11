import React from "react";
import Expo from "expo";
import { StyleSheet, Text, View, AlertIOS } from "react-native";
const recast = require("recast");

const Parser = require("./parser");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderBody = this.renderBody.bind(this);

    this.program = `let foo = () => {
    console.log("thing")\n}`;

    let parser = new Parser(this.program);
    this.state = {
      parser: parser
    };
    Expo.FileSystem
      .readDirectoryAsync(Expo.FileSystem.documentDirectory)
      .then(files => {
        console.log(files);
      });

    Expo.FileSystem
      .readAsStringAsync(Expo.FileSystem.documentDirectory + "App.js")
      .then(body => {
        let parser = new Parser(body);
        this.setState({ parser: parser });
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
  renderBody(element) {
    if (typeof element === "object") {
      return (
        <Text
          key={element.key}
          onPress={() => {
            this.displayType(element.node);
          }}
        >
          {element.children.map(this.renderBody)}
        </Text>
      );
    } else {
      return (<Text>{element}</Text>)
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.parser.tree.children.map(this.renderBody)}
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
