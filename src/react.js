import {REACT_ELEMENT, REACT_FORWARDREF} from './stants'
import { toObject } from './util'
import Component from './component'

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

const React = {
  createElement,
  Component,
  createRef,
  forwardRef
}

export default React