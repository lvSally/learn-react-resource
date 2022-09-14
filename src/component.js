import {towVnode} from './react-dom'
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
    this.updateComponent()
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
    let oldDom = oldVnode.dom

    towVnode(oldDom.parentNode, oldVnode, newVnode)

    this.oldReaderVnode = newVnode
  }
}