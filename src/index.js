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

function Input(props, ref) {
  return <input ref={ref}/>
}

let ForwardInput = React.forwardRef(Input)
// console.log(ForwardInput)

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.input1 = React.createRef()
  }

  handleClick = () => {
    // this.input1.current.onFocus()
    this.input1.current.focus()
  }

  render() {
    return <div>
      <ForwardInput ref={this.input1}/>
      <button onClick={this.handleClick}>Focus</button>
    </div>
  }
}
const element = <Form />

ReactDOM.render(
  element,
  document.getElementById('root')
);