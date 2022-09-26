import {REACT_TEXT, REACT_FORWARDREF} from './stants'
import addEvent from './event'

function render(vDom, container) {
  mount(vDom, container)
}

function mount(vDom, container) {
  const newDom = createDom(vDom)
  container.appendChild(newDom)
  if(newDom.componentDidMount) {
    newDom.componentDidMount()
  }
}

function createDom(vDom) {
  if(typeof vDom === 'string' || typeof vDom === 'number') {
    vDom = { type: REACT_TEXT, content: vDom }
  }

  const {type, props, content, ref} = vDom
  let dom
  if(type && type.$$typeof === REACT_FORWARDREF) {
    return mountForwardRef(vDom)
  }else if(type === REACT_TEXT) {
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
  vDom.dom = dom // 真实dom
  
  if(ref) {
    ref.current = dom
  }
  return dom
}

function mountForwardRef(vDom) {
  const {type, props, ref} = vDom
  let refVnode = type.render(props,ref)
  return createDom(refVnode)
}

function mountClassComponent(vDom) {
  const {type, props, ref} = vDom
  let classInstance = new type(props)
  if(ref) ref.current = classInstance

  if(classInstance.componentWillMount) {
    classInstance.componentWillMount()
  }
  let classVnode = classInstance.render()
  vDom.oldReaderVnode = classInstance.oldReaderVnode = classVnode
  let dom = createDom(classVnode)
  if(classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount
  }
  return dom
}

function mountFunctionComponent(vDom) {
  const {type, props} = vDom
  let functionVdom = type(props)
  vDom.oldReaderVnode = functionVdom
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
    } else if(key.startsWith('on')) {
      // dom[key.toLocaleLowerCase()] = newProps[key]
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])
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

export function towVnode(parentDom, oldVnode, newVnode, nextDom) {
  // let oldDom = findDom(oldVnode)
  // let newDom = createDom(newVnode)

  // parentDom.replaceChild(newDom, oldDom)

  if(!oldVnode && !newVnode) {
    return
  } else if(oldVnode && !newVnode) { // 删除
    unmountVnode(oldVnode)
  } else if(!oldVnode && newVnode) { // 添加
    mountNode(parentDom, newVnode, nextDom)
  } else if(oldVnode && newVnode && oldVnode.type != newVnode.type) { // 新旧vdom都存在， 类型包括 函数，class, 原生
    unmountVnode(oldVnode)
    mountNode(parentDom, newVnode, nextDom)
  }
}

function mountNode(parentDom, newVnode, nextDom) {
  let newDom = findDom(newVnode)
  if(nextDom) {
    parentDom.insertBefore(newDom, nextDom)
  } else {
    parentDom.appendChild(newDom)
  }

  if(newVnode.componentDidMount) {
    newVnode.componentDidMount()
  }
}

function unmountVnode(vDom) {
  let {type, props, ref} = vDom
  let currentDom = findDom(vDom)
  if(vDom.classInstance && vDom.classInstance.componentWillUnmount) {
    vDom.classInstance.componentWillUnmount()
  }

  if(ref) {
    ref.current = null
  }
  if(props.children) {
    let children = Array.isArray(props.children) ? props.children : [props.children]
    children.forEach(unmountVnode)
  }

  if(currentDom) {
    currentDom.parentNode.removeChild(currentDom)
  }
}

export function findDom(vdom) {
  if(!vdom) return null

  if(vdom.dom) {
    return vdom.dom
  }

  return findDom(vdom.oldReaderVnode)
}

const ReactDOM = {
  render
}

export default ReactDOM