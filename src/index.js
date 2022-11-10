import React from './react';
import ReactDOM from './react-dom';

function UseStateDemo() {
  const [num, setNum] = React.useState(0)
  const [num1, setNum1] = React.useState(0)
  return <div>
    <div>A:{num}</div>
    <div>B:{num1}</div>
    <div onClick={() => setNum(num+3)}>A</div>
    <div onClick={() => setNum1(num+1)}>B</div>
  </div>
}

ReactDOM.render(
  <UseStateDemo/>,
  document.getElementById('root')
);