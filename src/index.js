import React from './react';
import ReactDOM from './react-dom';

class ClassComponet extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    // return <h1>hello, {this.props.name}</h1>
    return React.createElement("h1", {}, "hello, ", this.props.name);
  }
}
// const element = <ClassComponet name="dog"/>
const element1 = React.createElement(ClassComponet, {
  name: "dog"
});
console.log(element1)

ReactDOM.render(
  element1,
  document.getElementById('root')
);