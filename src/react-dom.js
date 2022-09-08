import {REACT_TEXT} from './stants'

function render(vDom, container) {
  mount(vDom, container)
}

function mount(vDom, container) {
  const newDom = createDom(vDom)
  container.appendChild(newDom)
}

function createDom(vDom) {
  if(typeof vDom === 'string' || typeof vDom === 'number') {
    vDom = { type: REACT_TEXT, content: vDom }
  }

  const {type, props, content} = vDom
  let dom
  if(type === REACT_TEXT) {
    dom = document.createTextNode(content)
  } else if(typeof type === 'function') {
    if(type.isReactComponent) {
      return mountClassComponent(vDom)
    }
    return mountFunctionComponent(vDom)
  } else {
    dom = document.createElement(type)
  }

  if(props) {
    updataProps(dom, {}, props)

    let children = props.children
    if(children) {
      changeChildren(children, dom)
    }
  }
  

  return dom
}

function mountClassComponent(vDom) {
  const {type, props} = vDom
  let classInstance = new type(props)
  let classVnode = classInstance.render()
  return createDom(classVnode)
}

function mountFunctionComponent(vDom) {
  const {type, props} = vDom
  let functionVdom = type(props)
  return createDom(functionVdom)
}

function updataProps(dom, oldProps, newProps) {
  for(let key in newProps) {
    if(key === 'children') {
      continue
    } else if(key === 'style') {
      let styleObj = newProps[key]
      for(let arr in styleObj) {
        dom.style[arr] = styleObj[arr]
      }
    } else {
      dom[key] = newProps[key]
    }
  }

  if(oldProps) {
    for(let key in oldProps) {
      if(!newProps[key]) {
        dom[key] = null
      }
    }
  }
}

function changeChildren(children, dom) {
  if(typeof children === 'string' || typeof children === 'number') {
    children = { type: REACT_TEXT, content: children }
    mount(children, dom)
  } else if(typeof children === 'object' && children.type) {
    mount(children, dom)
  } else if(Array.isArray(children)) {
    children.forEach(item => mount(item, dom))
  }
}

const ReactDOM = {
  render
}

export default ReactDOM