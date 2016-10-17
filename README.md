React SVG Popover
=================

A Popover component rendered using SVG for [React](http://facebook.github.io/react/index.html).

## Demo & Examples

Live demo: https://davisml.github.io/react-svg-popover/

## Installation

The easiest way to use React SVG Popover is to install it from NPM and import it (using [Browserify](http://browserify.org), etc).

```sh
npm install react-svg-popover --save
```

Now you can import react-svg-popover as follows:

```js
import Popover from 'react-svg-popover'
```

## Usage

React SVG Popover can be customized using the style property. The default style is provided below as reference.

```js
const defaultStyle = {
    arrowCenter: 0.5,
    arrowDirection: Popover.direction.bottom,
    arrowLength: 16,
    arrowWidth: 32,
    borderRadius: 8,
    width: 200,
    height: 200,
    stroke: 'rgb(210,210,210)',
    strokeWidth: 1,
    padding: 10,
    boxSizing: 'content-box',
    position: 'absolute',
    dropShadow: '0px 1px 5px rgba(0,0,0,0.1)',
    background: 'linear-gradient(90deg, rgb(252, 252, 252), rgb(246, 246, 246))'
}
```

```jsx
return <Popover style={ defaultStyle }>
    Popover content
</Popover>
```

# License

MIT Licensed. Copyright (c) Mark Davis 2016.