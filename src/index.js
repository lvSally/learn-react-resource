import React from './react';
import ReactDOM from './react-dom';

class ClassComponet extends React.Component {
  constructor(props) {
    super(props)
    this.input1 = React.createRef()
    this.input2 = React.createRef()
    this.input3 = React.createRef()
  }

  handleClick = () => {
    this.input3.current.value = this.input1.current.value + this.input2.current.value
  }

  render() {
    return <div>
      <input ref={this.input1}/>
      +
      <input ref={this.input2}/>
      <button onClick={this.handleClick}>=</button>
      <input ref={this.input3}/>
    </div>
  }
}
const element = <ClassComponet />

ReactDOM.render(
  element,
  document.getElementById('root')
);