import React from './react';
import ReactDOM from './react-dom';

class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
    console.log('1 init（‘组件初始化’）')
  }

  handleFn = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }

  componentWillMount() {
    console.log('2 componentWillMount(‘组件挂载之前’)')
  }

  componentDidMount() {
    console.log('4 componentDidMount(‘组件挂载完毕’)')
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('5 shouldComponentUpdate(‘组件是否更新’)')
    return nextState.counter % 2 === 0
  }

  componentWillUpdate() {
    console.log('6 componentWillUpdate(‘组件更新之前’)')
  }

  componentDidUpdate() {
    console.log('7 componentDidUpdate(‘组件更新之后’)')
  }

  render() {
    console.log('3 render(‘组件render’)')
    return <div>
      <div onClick={this.handleFn}>hello world, {this.state.counter}</div>
      {this.state.counter%2===0 ? <Child num={this.state.counter}/> : null}
    </div>
  }
}

class Child extends React.Component{
  constructor(props) {
    super(props)
    console.log('1子组件 init（‘组件初始化’）')
  }

  componentWillMount() {
    console.log('2子组件 componentWillMount(‘组件挂载之前’)')
  }

  componentDidMount() {
    console.log('4子组件 componentDidMount(‘组件挂载完毕’)')
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log(nextProps, nextState)
    console.log('子组件 componentDidMount(‘子组件props更新’)')
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('5子组件 shouldComponentUpdate(‘组件是否更新’)')
    return nextState.counter % 2 === 0
  }

  componentWillUpdate() {
    console.log('6子组件 componentWillUpdate(‘组件更新之前’)')
  }

  componentDidUpdate() {
    console.log('7子组件 componentDidUpdate(‘组件更新之后’)')
  }

  componentWillUnmount() {
    console.log('8子组件 componentDidMount(‘组件卸载’)')
  }

  render() {
    console.log('3子组件 render(‘组件render’)')
    return <div>child:{this.props.num}</div>
  }
}
const element = <Parent />

ReactDOM.render(
  element,
  document.getElementById('root')
);