import {REACT_TEXT, REACT_FORWARDREF, MOVE, REACTNEXT, REACT_PROVIDER, REACT_CONTEXT} from './stants'
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

export function createDom(vDom) {
  // if(!vDom) return

  if(typeof vDom === 'string' || typeof vDom === 'number') {
    vDom = { type: REACT_TEXT, content: vDom }
  }

  const {type, props, content, ref} = vDom
  let dom
  if(type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vDom)
  }else if(type && type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vDom)
  }else if(type && type.$$typeof === REACT_FORWARDREF) {
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
    updateProps(dom, {}, props)

    let children = props.children
    if(children) {
      changeChildren(children, dom, props)
    }
  }
  vDom.dom = dom // 真实dom
  
  if(ref) {
    ref.current = dom
  }
  return dom
}

function mountContextComponent(vDom) {
  const {type, props} = vDom
  let context = type._context
  context._currentValue = props.value
  let renderVnode = type.children(context._currentValue)
  vDom.oldRenderVnode = renderVnode
  return createDom(renderVnode)
} 
function mountProviderComponent(vDom) {
  const {type, props} = vDom
  let context = type._context
  context._currentValue = props.value
  let renderVnode = type.children
  vDom.oldRenderVnode = renderVnode
  return createDom(renderVnode)
} 

function mountForwardRef(vDom) {
  const {type, props, ref} = vDom
  let refVnode = type.render(props,ref)
  return createDom(refVnode)
}

function mountClassComponent(vDom) {
  const {type, props, ref, content} = vDom
  let classInstance = new type(props)
  
  if(content) {
    classInstance.content = type.contentType._currentValue
  }

  vDom.classInstance = classInstance

  if(ref) ref.current = classInstance

  if(classInstance.componentWillMount) {
    classInstance.componentWillMount()
  }
  let classVnode = classInstance.render()
  vDom.oldRenderVnode = classInstance.oldRenderVnode = classVnode
  let dom = createDom(classVnode)
  if(classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount
  }
  return dom
}

function mountFunctionComponent(vDom) {
  const {type, props} = vDom
  let functionVdom = type(props)
  vDom.oldRenderVnode = functionVdom
  return createDom(functionVdom)
}

function updateProps(dom, oldProps, newProps) {  
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

function changeChildren(children, dom, props) {
  if(typeof children === 'string' || typeof children === 'number') {
    children = { type: REACT_TEXT, content: children }
    mount(children, dom)
  } else if(typeof children === 'object' && children.type) { // 单个children
    props.children.mountIndex = 0
    mount(children, dom)
  } else if(Array.isArray(children)) {// 多个children
    children.forEach((item, index) => {
      if(item) {
        item.mountIndex = index
        mount(item, dom)
      }
    })
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
  } else if(oldVnode && newVnode && oldVnode.type !== newVnode.type) { // 新旧vdom都存在， 类型包括 函数，class, 原生
    unmountVnode(oldVnode)
    mountNode(parentDom, newVnode, nextDom)
  } else {
    updateElement(oldVnode, newVnode)
  }
}

function updateElement(oldVnode, newVnode) {
  if(oldVnode.type === REACT_PROVIDER) {
    updateProviderComponent(oldVnode, newVnode)
  } else if(oldVnode.type === REACT_CONTEXT) {
    updateContextComponent(oldVnode, newVnode)
  } else if(oldVnode.type === REACT_TEXT && newVnode.type === REACT_TEXT) {
    let currentDom = oldVnode.dom = findDom(oldVnode)
    currentDom.textContent = newVnode.content
  } else if(typeof oldVnode.type === 'string') {
    let currentDom = oldVnode.dom = findDom(oldVnode)
    updateProps(currentDom, oldVnode.props, newVnode.props)
    updateChildren(currentDom, oldVnode.props.children, newVnode.props.children)
  } else if(typeof oldVnode.type === 'function') {
    if(oldVnode.type.isReactComponent) {
      oldVnode.classInstance = newVnode.classInstance
      updateClassComponent(oldVnode, newVnode)
    } else {
      updateFunctionComponent(oldVnode, newVnode)
    }
  }
}

function updateContextComponent(oldVnode, newVnode) {
  const parentDom = findDom(oldVnode).parentNode

  let {type, props} = newVnode
  let context = type._context
  context._currentValue = props.value

  let newRenderVdom = props.children(context._currentValue)
  towVnode(parentDom, oldVnode.oldRenderVnode, newRenderVdom)
  oldVnode.oldRenderVnode = newRenderVdom
}
function updateProviderComponent(oldVnode, newVnode) {
  const parentDom = findDom(oldVnode).parentNode

  let {type, props} = newVnode
  let context = type._context
  context._currentValue = props.value

  let newRenderVdom = props.children
  towVnode(parentDom, oldVnode.oldRenderVnode, newRenderVdom)
  oldVnode.oldRenderVnode = newRenderVdom
}

function updateClassComponent(oldVnode, newVnode) {
  const parentDom = findDom(oldVnode).parentNode

  let {type, props, ref} = newVnode
  let classInstance = new type(props)
  if(ref) {
    ref.current = classInstance
  }

  let newRenderVdom = classInstance.render()
  towVnode(parentDom, oldVnode.oldRenderVnode, newRenderVdom)

  // oldVnode.classInstance.oldRenderVnode = newRenderVdom
  oldVnode.oldRenderVnode = oldVnode.classInstance.oldRenderVnode = newRenderVdom
}

function updateFunctionComponent(oldVnode, newVnode) {
  const parentDom = findDom(oldVnode).parentNode

  let {type, props} = newVnode
  let newRenderVdom = type(props)
  towVnode(parentDom, oldVnode.oldRenderVnode, newRenderVdom)

  oldVnode.oldRenderVnode = newRenderVdom
}

function updateChildren(parentDom, oldChildren, newChildren) {
  oldChildren = Array.isArray(oldChildren) ? oldChildren : [oldChildren]
  newChildren = Array.isArray(newChildren) ? newChildren : [newChildren]
  // let maxLength = Math.max(oldChildren.length, newChildren.length)
  // for(let i=0; i<maxLength; i++) {
  //   let nextDom = oldChildren.find((item, index) => index > i && item && findDom(item))
  //   towVnode(currentDom, oldChildren[i], newChildren[i], nextDom)
  // }
  let keyedOldMap = {}
  oldChildren.forEach((oldChild, index) => {
    let oldKey = oldChild.key || index
    keyedOldMap[oldKey] = oldChild
  })

  let lastPlaceIndex = 0
  let patch = []
  newChildren.forEach((newChild, index) => {
    newChild.mountIndex = index
    let newKey = newChild.key || index

    let oldChild = keyedOldMap[newKey]
    if(oldChild) {
      updateElement(oldChild, newChild)
      
      if(oldChild.mountIndex < lastPlaceIndex) {
        patch.push({
          type: MOVE,
          oldChild,
          newChild,
          mountIndex: index
        })
      }

      delete keyedOldMap[newKey]
      lastPlaceIndex = Math.max(oldChild.mountIndex, newChild.mountIndex)
    } else {
      patch.push({
        type: REACTNEXT,
        newChild,
        mountIndex: index
      })
    }
  })

  // 处理move
  let moveChildren = patch.filter(item => item.type === MOVE).map(item => item.oldChild)

  Object.values(keyedOldMap).concat(moveChildren).forEach(oldChild => {
    let currentDom = findDom(oldChild)
    parentDom.removeChild(currentDom)
  })

  // 处理插入
  patch.forEach(action => {
    let {type, newChild, oldChild, mountIndex} = action
    let childNodes = parentDom.childNodes
    if(type === REACTNEXT) {
      let newDom = createDom(newChild)
      let childNode = childNodes[mountIndex]
      if(childNode) {
        parentDom.insertBefore(newDom, childNode)
      } else {
        parentDom.appendChild(newDom)
      }
    } else if(type === MOVE) {
      let oldDom = findDom(oldChild)
      let childNode = childNodes[mountIndex]
      if(childNode) {
        parentDom.insertBefore(oldDom, childNode)
      } else {
        parentDom.appendChild(oldDom)
      }
    }
  })
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
  let {props, ref} = vDom
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

  return findDom(vdom.oldRenderVnode)
}

const ReactDOM = {
  render
}

export default ReactDOM