import {towVnode, findDom} from './react-dom'

export const updateQueue = {
  isBatchData: false,
  updaters: [],
  batchUpdate() {
    updateQueue.updaters.forEach(updater => updater.updateComponent())
    updateQueue.isBatchData = false
    updateQueue.updaters.length = 0
  }
}

class Updater{
  constructor(classInstance) {
    this.classInstance = classInstance
    this.peddingState = []
  }

  addState(partialState) {
    this.peddingState.push(partialState)
    this.emitUpdate()
  }

  emitUpdate() {
    if(updateQueue.isBatchData) {
      updateQueue.updaters.push(this)
    } else {
      this.updateComponent()
    }
  }

  updateComponent() {
    let {classInstance, peddingState} = this
    if(peddingState.length > 0) {
      shouldUpdate(classInstance, this.getState())
    }
  }

  getState() {
    let {classInstance, peddingState} = this
    let {state} = classInstance

    peddingState.forEach(nestState => {
      state = {...state, ...nestState}
    })

    peddingState = []
    return state
  }
}

function shouldUpdate (classInstance, nextState) {
  classInstance.state = nextState

  classInstance.forceUpdate()
}
export default class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props

    this.updater = new Updater(this)
  }

  setState(partialState) {
    this.updater.addState(partialState)
  }

  forceUpdate(){
    let newVnode = this.render()
    let oldVnode = this.oldReaderVnode
    let oldDom = findDom(oldVnode)

    towVnode(oldDom.parentNode, oldVnode, newVnode)

    this.oldReaderVnode = newVnode
  }
}