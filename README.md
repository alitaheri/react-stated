# [React Stated](https://github.com/alitaheri/react-stated)
[![npm](https://badge.fury.io/js/react-stated.svg)](https://badge.fury.io/js/react-stated)
[![Build Status](https://travis-ci.org/alitaheri/react-stated.svg?branch=master)](https://travis-ci.org/alitaheri/react-stated)

React Stated is a Higher Order Component that externalizes uncontrolled logic from your
actual component. It greatly helps simplify the logic within your components while providing
a wider API for users who wish to use your components as uncontrolled. Most useful when
there are many fields in a form and keeping state is too much work.

## Installation

You can install this package with the following command:

```sh
npm install react-stated
```

## Examples

These examples demonstrate how you can use this library:

### Default behavior

If provided with no properties it will try to match the React's own API:

```js
import React from 'react';
import stated from 'react-stated';


class Component extends React.Component {
  render() {
    return <input value={this.props.value} onChange={this.props.onChange}/>
  }
}

const StatedComponent = stated()(Component);

// Treated as if it's uncontrolled. defaultValue and onChange work out of box
const instance = ReactDOM(
  <StatedComponent defaultValue="foo" onChange={(e) => alert(e.target.value)}/>, 
  document.getElementById('container')
);

// Extra goodies
instance.getValue(); // "foo"
instance.setValue("bar");
instance.clearValue(); // back to "foo"

```

### Other names

You can also pass an string or an array of strings to make stateful.

```js
import React from 'react';
import stated from 'react-stated';


class Component extends React.Component {
  render() {
    return (
      <div>
      <input value={this.props.myValue} onChange={this.props.onMyValueChange}/>
      <input value={this.props.myOtherValue} onChange={this.props.onMyOtherValueChange}/>
      </div>
    );
  }
}

const StatedComponent = stated(['myValue', 'myOtherValue'])(Component);

// Everything will change name
const instance = ReactDOM(
  <StatedComponent
    defaultMyValue="foo"
    onMyValueChange={(e) => alert(e.target.value)}
    defaultMyOtherValue="foo"
    onMyOtherValueChange={(e) => alert(e.target.value)}
  />, 
  document.getElementById('container')
);

instance.getMyValue();
instance.setMyValue("bar");
instance.clearMyValue();

instance.getMyOtherValue();
instance.setMyOtherValue("bar");
instance.clearMyOtherValue();

```

### Advanced control over the naming and behavior

You can pass an object instead of string. Or an array of mixed objects and strings.

```js
import React from 'react';
import stated from 'react-stated';


class Component extends React.Component {
  constructor(props) {
    super(props);
    // Some differed callbacks might look like this!
    this.handle = (e) => this.props.onTargetChange(null, e.target.value);
  }
  render() {
    return (
      <div>
      <input value={this.props.val} onChange={this.handle}/>
      </div>
    );
  }
}

const StatedComponent = stated({
  // The name of the prop is required.
  name: 'val';
  
  // These are optional, they override the default naming scheme.
  
  // The getter.
  get: 'getMyVal';
  // The setter.
  set: 'setMyVal';
  // The clear method.
  clear: 'clear';
  // The name of the defaultValue prop.
  default: 'valDefault';
  // The name of the onChange method that is passed down to stated.
  change: 'change';
  // The callback function that stated passes down to it's wrapped component.
  callback: 'onTargetChange';
  // This function is used to capture the value from the callback.
  // useful when the API of the target component doesn't follow React.
  getValue: (e, v) => v || e.target.value;
})(Component);

// Everything will change name
const instance = ReactDOM(
  <StatedComponent
    valDefault="foo"
    change={(e, v) => alert(v)}
  />, 
  document.getElementById('container')
);

instance.getMyVal();
instance.setMyVal("bar");
instance.clear();

```

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-memo/blob/master/LICENSE).
