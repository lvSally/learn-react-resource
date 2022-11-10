import {REACT_ELEMENT, REACT_FORWARDREF, REACT_CONTEXT, REACT_PROVIDER} from './stants'
import { toObject } from './util'
import Component from './component'
import {useState} from './react-dom'

function createElement(type, config, children) {
  let key, ref
  if(config) {
    key = config.key
    ref = config.ref
    delete config.key
    delete config.ref
  }
  let props = {...config}
  if(config) {
    if(arguments.length > 3) {
      props.children = Array.prototype.slice.call(arguments, 2).map(toObject)
    } else if(arguments.length === 3) {
      props.children = toObject(children)
    }
  }

  return {
    $$typeof: REACT_ELEMENT,
    key,
    ref,
    type,
    props
  }
}

function createRef() {
  return {
    current: null
  }
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARDREF,
    render
  }
}

function createContext() {
  let context = {
    $$typeof: REACT_CONTEXT,
    _currentValue: undefined
  }
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context
  }
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context
  }
  return context
}

function cloneElement(oldElement, props, children) {
  if(arguments.length > 3) {
    props.children = Array.prototype.slice(arguments, 2).map(toObject)
  } else if(arguments.length === 3) {
    props.children = toObject(children)
  }
  return {
    ...oldElement,
    props
  }
}

class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // let flag = equalFn()
    return true // TODO: do sth equal option
  }
}

const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  forwardRef,
  createContext,
  cloneElement,
  useState
}

export default React