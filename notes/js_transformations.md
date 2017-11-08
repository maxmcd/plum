# Go Transformations

Import
```js
import React from "react";
```
```xml
<ImportDeclaration>import 
    <ImportDefaultSpecifier>
        <Identifier>React</Identifier>
    </ImportDefaultSpecifier> 
    from 
    <Literal>"react"</Literal>;
</ImportDeclaration>

```

Variable assignment
```js
const jsx = false
```

```xml
<VariableDeclaration>const 
    <VariableDeclarator>
        <Identifier>jsx</Identifier>
         = 
        <Literal>false</Literal>
    </VariableDeclarator>
</VariableDeclaration>
```

Conditional
```js
print()
//=>
if (true) {
    print()
}
```

```xml
<ExpressionStatement><CallExpression>
    <Identifier>print</Identifier>()
</CallExpression></ExpressionStatement>

<IfStatement>if (<Literal>true</Literal>) <BlockStatement>{
    <ExpressionStatement><CallExpression>
        <Identifier>print</Identifier>()
    </CallExpression></ExpressionStatement>
}</BlockStatement></IfStatement>
```


Expression Statement
```js
ellipse();
```

```xml
<ExpressionStatement>
    <CallExpression>
        <Identifier>ellipse</Identifier>()
    </CallExpression>;
</ExpressionStatement>
```

Add Parameter
```js
ellipse();
//=>
ellipse(300);
```

```xml
<ExpressionStatement>
    <CallExpression>
        <Identifier>ellipse</Identifier>()
    </CallExpression>;
</ExpressionStatement>

<ExpressionStatement>
    <CallExpression>
        <Identifier>ellipse</Identifier>(
        <Literal>300</Literal>)
    </CallExpression>;
</ExpressionStatement>
```

Function declaration
```js
function thing(){}
```

```xml
<FunctionDeclaration>function
  <Identifier>thing</Identifier>()
  <BlockStatement>{}</BlockStatement>
</FunctionDeclaration>
```