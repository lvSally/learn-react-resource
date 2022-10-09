import {towVnode, findDom, createDom} from './react-dom'

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
    let {classInstance, peddingState, nextProps} = this
    if(nextProps || peddingState.length > 0) {
      shouldUpdate(classInstance, this.getState(), nextProps)
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

function shouldUpdate (classInstance, nextState, nextProps) {

  let willUpdate = true
  if(classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
    willUpdate = false // 表示也没不更新
  }

  if(nextState) {
    classInstance.state = nextState
  }
  
  if(willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate()
  }

  if(nextProps) {
    classInstance.nextProps = nextProps
  }

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
    let oldVnode = this.oldRenderVnode
    let oldDom = findDom(oldVnode)

    if(this.constructor.getDerivedStateFromProps) {
      let newState = this.constructor.getDerivedStateFromProps(this.props, this.state)
      if(newState) {
        this.state = {...this.state, ...newState}
      }
    }

    let newVnode = this.render()
    newVnode.dom = createDom(newVnode)
    let snapshot = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate()
    towVnode(oldDom.parentNode, oldVnode, newVnode)

    this.oldRenderVnode = newVnode

    if(this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapshot)
    }
  }
}