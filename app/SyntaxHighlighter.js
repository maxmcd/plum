import React from "react";
import { Text, ScrollView, Platform } from "react-native";
import SyntaxHighlighter from "react-syntax-highlighter-prismjs";
import {
  createStyleObject
} from "react-syntax-highlighter-prismjs/dist/create-element";
import { defaultStyle } from "react-syntax-highlighter-prismjs/dist/styles";
import util from "./util";

const styleCache = new Map();

function generateNewStylesheet(stylesheet) {
  if (styleCache.has(stylesheet)) {
    return styleCache.get(stylesheet);
  }
  const transformedStyle = Object.entries(
    stylesheet
  ).reduce((newStylesheet, [className, style]) => {
    newStylesheet[className] = Object.entries(
      style
    ).reduce((newStyle, [key, value]) => {
      if (key === "overflowX") {
        newStyle.overflow = value === "auto" ? "scroll" : value;
      } else if (value.includes("em")) {
        const [num] = value.split("em");
        newStyle[key] = Number(num) * 16;
      } else if (key === "background") {
        newStyle.backgroundColor = value;
      } else if (key === "display") {
        return newStyle;
      } else {
        newStyle[key] = value;
      }
      return newStyle;
    }, {});
    return newStylesheet;
  }, {});
  const defaultColor =
    (transformedStyle.hljs && transformedStyle.hljs.color) || "#000";
  if (transformedStyle.hljs && transformedStyle.hljs.color) {
    delete transformedStyle.hljs.color;
  }
  styleCache.set(stylesheet, { transformedStyle, defaultColor });
  return { transformedStyle, defaultColor };
}

function createChildren({
  stylesheet,
  fontSize,
  fontFamily,
  row,
  onClickToken,
  selectedNode
}) {
  let childrenCount = 0;
  return (children, defaultColor) => {
    childrenCount += 1;
    return children.map((child, i) =>
      createNativeElement({
        node: child,
        stylesheet,
        key: `code-segment-${childrenCount}-${i}`,
        defaultColor,
        fontSize,
        fontFamily,
        row,
        onClickToken,
        selectedNode
      })
    );
  };
}
let cursor = {};
function createNativeElement({
  node,
  stylesheet,
  key,
  defaultColor,
  fontFamily,
  fontSize = 12,
  row,
  onClickToken,
  selectedNode
}) {
  const { properties, type, tagName: TagName, value } = node;
  const startingStyle = { fontFamily, fontSize, height: fontSize + 2 };
  if (type === "text") {
    let parts = util.trimAndReturnParts(value);
    return parts.map((part, i) => {
      if (!cursor[row]) {
        cursor[row] = 0;
      }
      let start = cursor[row];
      let end = start + part.length;
      cursor[row] += part.length;

      let backgroundColor;

      let loc = {
        start: { line: row, column: start },
        end: { line: row, column: end }
      };

      if (selectedNode && util.isWithinLoc(selectedNode.node.loc, loc)) {
        backgroundColor = "#ffffff50";
      }

      return (
        <Text
          key={key + "-" + i}
          style={Object.assign(
            { color: defaultColor, backgroundColor: backgroundColor },
            startingStyle
          )}
          onPress={() => {
            onClickToken({ node, loc });
          }}
        >
          {part}
        </Text>
      );
    });
  } else if (TagName) {
    const childrenCreator = createChildren({
      stylesheet,
      fontSize,
      fontFamily,
      row,
      onClickToken,
      selectedNode
    });
    const style = createStyleObject(
      properties.className,
      Object.assign({ color: defaultColor }, properties.style, startingStyle),
      stylesheet
    );
    const children = childrenCreator(
      node.children,
      style.color || defaultColor
    );
    return (
      <Text
        key={key}
        style={style}
        onPress={() => {
          console.log(row, node.children.length);
        }}
      >
        {children}
      </Text>
    );
  }
}

function nativeRenderer({
  defaultColor,
  fontFamily,
  fontSize,
  onClickToken,
  selectedNode
}) {
  return ({ rows, stylesheet }) => {
    return util.timeIt(
      () => {
        let out = rows.map((node, i) => {
          return createNativeElement({
            node,
            stylesheet,
            key: `code-segment-${i}`,
            defaultColor,
            fontFamily,
            fontSize,
            row: i + 1,
            onClickToken: onClickToken,
            selectedNode
          });
        });
        cursor = {};
        return out;
      },
      "Syntax Highlighting",
      20
    );
  };
}

function NativeSyntaxHighlighter({
  fontFamily,
  fontSize,
  style,
  children,
  onClickToken,
  selectedNode,
  ...rest
}) {
  const { transformedStyle, defaultColor } = generateNewStylesheet(style);
  return (
    <SyntaxHighlighter
      {...rest}
      style={transformedStyle}
      horizontal={true}
      renderer={nativeRenderer({
        defaultColor,
        fontFamily,
        fontSize,
        onClickToken,
        selectedNode
      })}
    >
      {children}
    </SyntaxHighlighter>
  );
}

NativeSyntaxHighlighter.defaultProps = {
  fontFamily: Platform.OS === "ios" ? "Menlo-Regular" : "monospace",
  fontSize: 16,
  style: defaultStyle,
  PreTag: ScrollView,
  CodeTag: ScrollView
};

export default NativeSyntaxHighlighter;
