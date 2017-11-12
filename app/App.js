import React from "react";
import Expo from "expo";
import { StyleSheet, Text, View, AlertIOS, ScrollView } from "react-native";
import SyntaxHighlighter from './SyntaxHighlighter';
import { darcula } from 'react-syntax-highlighter-prismjs/dist/styles';
import util from './util';

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

    this._getNodeForLoc = this._getNodeForLoc.bind(this)
    this.onClickToken = this.onClickToken.bind(this)

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
  _getNodeForLoc(loc) {
    let lastMatch;
    let start = Date.now()
    recast.visit(this.ast, {
      visitNode: function(path) {
        if (!path.node.loc) {
          this.traverse(path)
        } else if (util.isWithinLoc(path.node.loc, loc)) {
          lastMatch = path.node
          this.traverse(path)
        } else {
          return false
        }
      }
    })
    let end = Date.now()
    let ms = end - start
    if (ms > 5) {
      console.debug(`AST node search took ${ms} ms. Longer than expected.`)  
    }
    console.log(lastMatch.type)
  }
  onClickToken({loc, node}) {
    this._getNodeForLoc(loc)
  }
  render() {
    return (
      <SyntaxHighlighter 
        language='javascript' 
        style={darcula}
        onClickToken={this.onClickToken}

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
