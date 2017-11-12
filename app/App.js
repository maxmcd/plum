import React from "react";
import Expo from "expo";
import { StyleSheet, Text, View, AlertIOS, ScrollView } from "react-native";
import SyntaxHighlighter from './SyntaxHighlighter';
import { tomorrow } from 'react-syntax-highlighter/src/styles';

const recast = require("recast");

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.program = `let foo = () => {
    console.log("thing")\n}`;
    this.ast = recast.parse(this.program);
    this.state = {
      program: this.program,
      ast: this.ast
    };
    Expo.FileSystem
      .readDirectoryAsync(Expo.FileSystem.documentDirectory)
      .then(files => {
        console.log(files);
      });

    Expo.FileSystem
      .readAsStringAsync(Expo.FileSystem.documentDirectory + "App.js")
      .then(body => {
        this.ast = recast.parse(body);
        this.setState({ 
          ast: this.ast, 
          program: body
        });
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

  render() {
    return (
      <SyntaxHighlighter 
        language='javascript' 
        style={tomorrow}
      >
        {this.state.program}
      </SyntaxHighlighter>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333"
  }
});
