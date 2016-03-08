/// <reference path="../typings/main.d.ts" />

import * as Promise from 'bluebird';
import * as React from 'react';
import * as TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import * as jsdom from 'jsdom';

(global as any).document = jsdom.jsdom('<html><body><div id="root"></div></body></html>');
(global as any).window = (document as any).defaultView;

import stated from '../src';

class Test extends React.Component<any, any> {
  render() {
    setTimeout(() => this.props.onChange({ target: { value: 'foo' } }));
    return <input id="input" type="text" onChange={() => { } } value={this.props.value}/>;
  }
}

class DumbTest extends React.Component<any, any> {
  render() {
    return <input id="input" type="text" defaultValue="foo"/>;
  }
}

class FlexibleTest extends React.Component<any, any> {
  render() {
    const name: string = this.props.propName;
    setTimeout(() => {
      this.props['on' + name[0].toUpperCase() + name.substring(1) + 'Change']({ target: { value: 'foo' } });
    });
    return <input id="input" type="text" onChange={() => { } } value={this.props[this.props.propName]}/>;
  }
}

describe('stated', () => {

  it('should manage the component with the default setting', () => {
    const WrappedTest = stated()(Test);

    let val;
    const dom: any = TestUtils.renderIntoDocument(
      <WrappedTest onChange={(e) => val = e.target.value} defaultValue="bar"/>
    );

    const resultElement = TestUtils.findRenderedComponentWithType(dom, Test);
    expect(resultElement.props.value).to.be.equal('bar');

    dom.setValue('baz');
    expect(resultElement.props.value).to.be.equal('baz');
    expect(dom.getValue()).to.be.equals('baz');

    dom.clearValue();

    expect(resultElement.props.value).to.be.equal('bar');
    expect(dom.getValue()).to.be.equals('bar');

    return (Promise.delay as any)(10).then(() => {
      expect(resultElement.props.value).to.be.equal('foo');
      expect(val).to.be.equals('foo');
    });

  });

  it('should manage the component with custom names', () => {
    const WrappedTest = stated('val')(FlexibleTest);

    const dom: any = TestUtils.renderIntoDocument(<WrappedTest propName="val" defaultVal="bar"/>);

    const resultElement = TestUtils.findRenderedComponentWithType(dom, FlexibleTest);
    expect(resultElement.props.val).to.be.equal('bar');

    dom.setVal('baz');
    expect(resultElement.props.val).to.be.equal('baz');
    expect(dom.getVal()).to.be.equals('baz');

    dom.clearVal();

    expect(resultElement.props.val).to.be.equal('bar');
    expect(dom.getVal()).to.be.equals('bar');

    return (Promise.delay as any)(10).then(() => {
      expect(resultElement.props.val).to.be.equal('foo');
    });

  });

  it('should with multiple stated props', () => {
    const WrappedTest = stated(['val1', 'val2', 'val3'])(DumbTest);

    const dom: any = TestUtils.renderIntoDocument(
      <WrappedTest defaultVal1="bar1" defaultVal2="bar2" defaultVal3="bar3"/>
    );

    const resultElement = TestUtils.findRenderedComponentWithType(dom, DumbTest);
    expect(resultElement.props.val1).to.be.equal('bar1');
    expect(resultElement.props.val2).to.be.equal('bar2');
    expect(resultElement.props.val3).to.be.equal('bar3');

    dom.setVal1('baz1');
    dom.setVal2('baz2');
    dom.setVal3('baz3');

    expect(resultElement.props.val1).to.be.equal('baz1');
    expect(resultElement.props.val2).to.be.equal('baz2');
    expect(resultElement.props.val3).to.be.equal('baz3');

    expect(dom.getVal1()).to.be.equals('baz1');
    expect(dom.getVal2()).to.be.equals('baz2');
    expect(dom.getVal3()).to.be.equals('baz3');

    dom.clearVal1();
    dom.clearVal2();
    dom.clearVal3();

    expect(resultElement.props.val1).to.be.equal('bar1');
    expect(resultElement.props.val2).to.be.equal('bar2');
    expect(resultElement.props.val3).to.be.equal('bar3');

    expect(dom.getVal1()).to.be.equals('bar1');
    expect(dom.getVal2()).to.be.equals('bar2');
    expect(dom.getVal3()).to.be.equals('bar3');
  });

  it('should work with custom stated props', () => {
    const WrappedTest = stated({
      name: 'value',
      change: 'change',
      set: 'set',
      get: 'get',
      clear: 'clear',
      callback: 'onChange',
      default: 'def',
      getValue: () => 'overriden',
    })(Test);

    let val;
    const dom: any = TestUtils.renderIntoDocument(
      <WrappedTest change={(e) => val = e.target.value} def="bar"/>
    );

    const resultElement = TestUtils.findRenderedComponentWithType(dom, Test);
    expect(resultElement.props.value).to.be.equal('bar');

    dom.set('baz');
    expect(resultElement.props.value).to.be.equal('baz');
    expect(dom.get()).to.be.equals('baz');

    dom.clear();

    expect(resultElement.props.value).to.be.equal('bar');
    expect(dom.get()).to.be.equals('bar');

    return (Promise.delay as any)(10).then(() => {
      expect(resultElement.props.value).to.be.equal('overriden');
      expect(val).to.be.equals('foo');
    });

  });

  it('should work with partially custom stated props', () => {
    const WrappedTest = stated({
      name: 'value',
      change: 'change',
      callback: 'onChange',
      default: 'def',
    })(Test);

    let val;
    const dom: any = TestUtils.renderIntoDocument(
      <WrappedTest change={(e) => val = e.target.value} def="bar"/>
    );

    const resultElement = TestUtils.findRenderedComponentWithType(dom, Test);
    expect(resultElement.props.value).to.be.equal('bar');

    dom.setValue('baz');
    expect(resultElement.props.value).to.be.equal('baz');
    expect(dom.getValue()).to.be.equals('baz');

    dom.clearValue();

    expect(resultElement.props.value).to.be.equal('bar');
    expect(dom.getValue()).to.be.equals('bar');

    return (Promise.delay as any)(10).then(() => {
      expect(resultElement.props.value).to.be.equal('foo');
      expect(val).to.be.equals('foo');
    });

  });

  it('should work with mixed custom and normal stated props', () => {
    const WrappedTest = stated(['val1', {
      name: 'val2',
      default: 'def2',
      set: 'set2',
      clear: 'clear2',
    }, 'val3'])(DumbTest);

    const dom: any = TestUtils.renderIntoDocument(
      <WrappedTest defaultVal1="bar1" def2="bar2" defaultVal3="bar3"/>
    );

    const resultElement = TestUtils.findRenderedComponentWithType(dom, DumbTest);
    expect(resultElement.props.val1).to.be.equal('bar1');
    expect(resultElement.props.val2).to.be.equal('bar2');
    expect(resultElement.props.val3).to.be.equal('bar3');

    dom.setVal1('baz1');
    dom.set2('baz2');
    dom.setVal3('baz3');

    expect(resultElement.props.val1).to.be.equal('baz1');
    expect(resultElement.props.val2).to.be.equal('baz2');
    expect(resultElement.props.val3).to.be.equal('baz3');

    expect(dom.getVal1()).to.be.equals('baz1');
    expect(dom.getVal2()).to.be.equals('baz2');
    expect(dom.getVal3()).to.be.equals('baz3');

    dom.clearVal1();
    dom.clear2();
    dom.clearVal3();

    expect(resultElement.props.val1).to.be.equal('bar1');
    expect(resultElement.props.val2).to.be.equal('bar2');
    expect(resultElement.props.val3).to.be.equal('bar3');

    expect(dom.getVal1()).to.be.equals('bar1');
    expect(dom.getVal2()).to.be.equals('bar2');
    expect(dom.getVal3()).to.be.equals('bar3');
  });

});
