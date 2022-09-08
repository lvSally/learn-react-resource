import {REACT_TEXT} from './stants'

function render(vDom, container) {
  mount(vDom, container)
}

function mount(vDom, container) {
  const newDom = createDom(vDom)
  container.appendChild(newDom)
}

function createDom(vDom) {
  const {type, props, content} = vDom
  let dom
  if(type === REACT_TEXT) {
    dom = document.createTextNode(content)
  } else if(typeof type === 'function') {
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

function mountFunctionComponent(vDom) {
  const {type, props} = vDom
  let functionVdom = type(props)
  console.log(type, functionVdom)
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
  if(typeof children === 'object' && children.type) {
    mount(children, dom)
  } else if(Array.isArray(children)) {
    children.forEach(item => mount(item, dom))
  }
}

const ReactDOM = {
  render
}

export default ReactDOM