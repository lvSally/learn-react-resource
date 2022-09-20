import {updateQueue} from './component'
/**
 * 
 * @param {*} dom 真实dom
 * @param {*} eventType 事件类型
 * @param {*} handler 事件处理函数
 */
export default function addEvnet(dom, eventType, handler) {
  let store = dom.store || (dom.store={})
  store[eventType] = handler

  if(store[eventType]) {
    document[eventType] = dispatchEvent
  }
}

function dispatchEvent(event) {
  let {target, type} = event
  let eventType = `on${type}`
  let {store} = target

  let handler = store && store[eventType]
  updateQueue.isBatchData = true
  handler && handler(event)
  updateQueue.isBatchData = false
  updateQueue.batchUpdate()
}