import React from './react';
import ReactDOM from './react-dom';

class ClassComponet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 1
    }
  }

  handleClick = () => {
    this.setState({num: this.state.num + 1})
    this.setState({num: this.state.num + 1})

    setTimeout(() => {
      this.setState({num: this.state.num + 1})
    });
  }

  render() {
    return <div>
      <h1>{this.state.num}</h1>
      <button onClick={this.handleClick}>+</button>
    </div>
    // return React.createElement("h1", {}, "hello, ", this.props.name);
  }
}
const element = <ClassComponet />
// const element1 = React.createElement(ClassComponet, {
//   name: "dog"
// });
// console.log(element)

ReactDOM.render(
  element,
  document.getElementById('root')
);