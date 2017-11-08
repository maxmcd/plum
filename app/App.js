import React from "react";
import Expo from "expo";
import { StyleSheet, Text, View, AlertIOS } from "react-native";
const recast = require("recast");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      ast: null
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
  render() {
    return (
      <View style={styles.container}>
        <Text
          onPress={() => {
            this.displayType("File");
          }}
        >
          {""}<Text
            onPress={() => {
              this.displayType("Program");
            }}
          >
            {""}<Text
              onPress={() => {
                this.displayType("VariableDeclaration");
              }}
            >
              {"const "}<Text
                onPress={() => {
                  this.displayType("VariableDeclarator");
                }}
              >
                {""}<Text
                  onPress={() => {
                    this.displayType("Identifier");
                  }}
                >
                  {"h"}
                </Text>{" = "}<Text
                  onPress={() => {
                    this.displayType("Literal");
                  }}
                >
                  {'"hi"'}
                </Text>{""}
              </Text>{";"}
            </Text>{"\n"}<Text
              onPress={() => {
                this.displayType("ExpressionStatement");
              }}
            >
              {""}<Text
                onPress={() => {
                  this.displayType("ArrowFunctionExpression");
                }}
              >
                {"() => "}<Text
                  onPress={() => {
                    this.displayType("BlockStatement");
                  }}
                >
                  {"{\n    "}<Text
                    onPress={() => {
                      this.displayType("ExpressionStatement");
                    }}
                  >
                    {""}<Text
                      onPress={() => {
                        this.displayType("CallExpression");
                      }}
                    >
                      {""}<Text
                        onPress={() => {
                          this.displayType("MemberExpression");
                        }}
                      >
                        {""}<Text
                          onPress={() => {
                            this.displayType("Identifier");
                          }}
                        >
                          {"console"}
                        </Text>{"."}<Text
                          onPress={() => {
                            this.displayType("Identifier");
                          }}
                        >
                          {"log"}
                        </Text>{""}
                      </Text>{"("}<Text
                        onPress={() => {
                          this.displayType("Literal");
                        }}
                      >
                        {'"foo"'}
                      </Text>{")"}
                    </Text>{";"}
                  </Text>{"\n}"}
                </Text>{""}
              </Text>{";"}
            </Text>{""}
          </Text>{""}
        </Text>
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
