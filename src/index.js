import React from './react';
import ReactDOM from './react-dom';

function FunctionComponect(props) {
  // return <h1>hello, {props.name}</h1>
  return React.createElement('h1', {style: {color: 'red'}}, 66)
}
const element = <FunctionComponect name="dog"/>
const element1 = React.createElement(FunctionComponect, {
  name: "dog"
});
console.log(element1)

ReactDOM.render(
  element1,
  document.getElementById('root')
);