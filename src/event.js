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
  let syntheticBaseEvent = createBaseEvent(event)
  handler && handler(syntheticBaseEvent)
  updateQueue.isBatchData = false
  updateQueue.batchUpdate()
}

function createBaseEvent(nativeEvent) {
  let syntheticBaseEvent = {}

  for(let key in nativeEvent) {
    syntheticBaseEvent[key] = nativeEvent[key]
  }

  syntheticBaseEvent.nativeEvent = nativeEvent

  // 兼容处理默认事件
  syntheticBaseEvent.preventDefault = preventDefault

  return syntheticBaseEvent
}

function preventDefault(event) {
  if(!event) {
    window.event.returnValue = false
  } 
  if(event.preventDefault) {
    event.preventDefault()
  }
}