import React from "react";
import Expo from "expo";
import { StyleSheet, Text, View } from "react-native";
const recast = require("recast");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      ast: null,
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
        // take every node of the ast
        // wrap it a text and consider assigning
        // it a color. then you have syntax highlighting
        // based on object type
        // then make each one clickable so that you
        // can explore the data in each element
        // be sure to format correctly and ensure that
        // the performance of 1000's of Text elements
        // is not terrible
        const output = recast.prettyPrint(ast).code;
        this.setState({
          text: output.split('\n'),
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
    this.state.text[location]
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.code}</Text>
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
