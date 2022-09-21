import React from './react';
import ReactDOM from './react-dom';

class Input1 extends React.Component {
  constructor(props) {
    super(props)
    this.input1 = React.createRef()
  }

  onFocus = () => {
    this.input1.current.focus()
  }

  render() {
    return <div>
      <input ref={this.input1}/>
    </div>
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.input1 = React.createRef() // 此处为类的实例
  }

  handleClick = () => {
    this.input1.current.onFocus()
  }

  render() {
    return <div>
      <Input1 ref={this.input1}/>
      <button onClick={this.handleClick}>Focus</button>
    </div>
  }
}
const element = <Form />

ReactDOM.render(
  element,
  document.getElementById('root')
);