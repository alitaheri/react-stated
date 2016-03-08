import * as React from 'react';

export interface Wrapper {
  <P>(Component: React.ComponentClass<P>): React.ComponentClass<P>;
}

interface Callbacks {
  [callback: string]: (event: React.SyntheticEvent, ...rest: any[]) => any;
}

export interface StatedProp {
  name: string;
  get?: string;
  set?: string;
  clear?: string;
  default?: string;
  change?: string;
  callback?: string;
  getValue?: (...args: any[]) => any;
}

function titlize(prop: string): string {
  return prop[0].toUpperCase() + prop.substr(1);
}

function buildStated(prop: string, overrides?: StatedProp): StatedProp {
  return {
    name: prop,
    get: (overrides && overrides.get) || `get${titlize(prop)}`,
    set: (overrides && overrides.set) || `set${titlize(prop)}`,
    clear: (overrides && overrides.clear) || `clear${titlize(prop)}`,
    default: (overrides && overrides.default) || `default${titlize(prop)}`,
    change: (overrides && overrides.change) || `on${titlize(prop)}Change`,
    callback: (overrides && overrides.callback) || `on${titlize(prop)}Change`,
    getValue: (overrides && overrides.getValue) || (event => event.target.value),
  }
}

function normalize(props?: any): StatedProp[] {

  if (!props) {
    return [{
      name: 'value',
      get: 'getValue',
      set: 'setValue',
      clear: 'clearValue',
      default: 'defaultValue',
      change: 'onChange',
      callback: 'onChange',
      getValue: event => event.target.value,
    }];
  }

  if (typeof props === 'string') {
    return [buildStated(props)];
  }

  if (Array.isArray(props)) {
    return props.map(prop => {

      if (typeof prop === 'string') {
        return buildStated(prop);
      }

      if (prop && typeof prop === 'object') {
        return buildStated(prop.name, prop);
      }

    }).filter(prop => prop);
  }

  if (typeof props === 'object') {
    return [buildStated(props.name, props)];
  }

  return [];
}

export default function stated(props?: string): Wrapper;
export default function stated(props?: StatedProp): Wrapper;
export default function stated(props?: Array<string | StatedProp>): Wrapper;
export default function stated(props?: any): Wrapper {
  const statedProps = normalize(props);

  return function wrapper<PTarget>(Component: React.ComponentClass<any>): React.ComponentClass<PTarget> {
    class Stated extends React.Component<any, any> {
      private callbacks: Callbacks;
      constructor(props: any) {
        super(props);

        this.callbacks = {};
        this.state = {};

        statedProps.forEach(stated => {

          this.state[stated.name] = props[stated.default];

          this.callbacks[stated.callback] = (...args: any[]) => {

            this.setState({ [stated.name]: stated.getValue(...args) });

            if (typeof this.props[stated.change] === 'function') {
              this.props[stated.change](...args);
            }

          };

          this[stated.get] = () => this.state[stated.name];
          this[stated.set] = (value: any) => this.setState({ [stated.name]: value });
          this[stated.clear] = () => this.setState({ [stated.name]: this.props[stated.default] });

        });

      }

      render() {
        return <Component {...this.props} {...this.state} {...this.callbacks} />;
      }
    }

    return Stated as any;
  }
}
