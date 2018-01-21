# Plum

It's this: https://www.facebook.com/notes/kent-beck/prune-a-code-editor-that-is-not-a-text-editor/1012061842160013/

## Current Status

A rough text reader is complete. Spin up the react native app in `/app` tap on text to navigate the AST. 

## Next Steps

Get the application to the point where the AST can be crawled, new nodes can be altered and nodes can be deleted. All editing should be technically possible at this point, new functionality can be added from there.

Currently nodes are selected and their properties are read for data. Let's shift to using the ast-types library to describe nodes. When a node is selected show all of the node fields. Node fields can be of 4 types:

1. A simple value (string, integer)
2. A value from a list
2. A single node
3. A list of nodes

Some of the fields have default values, options, or are restricted to certain node types. When a node is selected all fields should be shown. If their value is simple, editing should be allowed. If the value is a node, navigation to that node should be possible. If the value is a list, navigation to a list view should be possible. Adding a new node to any node list, or deleting any node from a node list, should also be possible.

There are some cases not covered here. Replacing a node of a certain type, changing node order, and likely many other cases I have missed.

## Larger goals

1. Construct basic working editor
2. Switch to editing the editor only with the editor
3. Make performance and usability improvements
4. Incorporate linting, tooling, and other helpful tools as necessary
5. Re-think syntax highlighting in the context of not writing text
6. Provide some kind of external runtime to process code




