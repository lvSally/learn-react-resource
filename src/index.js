import React from 'react';
import ReactDOM from 'react-dom';

class One extends React.Component {
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
    return <div onClick={this.handleFn}>hello world, {this.state.counter}</div>
  }
}
const element = <One />

ReactDOM.render(
  element,
  document.getElementById('root')
);