import React from 'react';
import Expo from 'expo';
import { StyleSheet, Text, View } from 'react-native';
const recast = require("recast");

// console.log(esprima)

// console.log(ast)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {code: "hiasdf"}
    Expo.FileSystem.downloadAsync("http://localhost:7654/App.js", `${Expo.FileSystem.documentDirectory}App.js`)
    .then(({uri}) => {
      console.log(uri)
      return uri
    })
    .then(Expo.FileSystem.readAsStringAsync)
    .then((body) => {
      const ast = recast.parse(body)
      const output = recast.prettyPrint(ast).code;
      this.setState({code: output})
    }).catch((err) => {
      console.log(err)
    })
  }
  renderText(err, data) {
    if (err) {
      return console.log(err)
    }
    this.setState({code: data})
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
