import React from './react';
import ReactDOM from './react-dom';
let element = <h1 className="title" style={{color: 'red'}} key="1">hello</h1>
let element1 = React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  },
  key: "1"
}, 'hello', React.createElement('span', {style: {color: 'green'}}, 123), '000');
console.log(element1)
ReactDOM.render(
  element1,
  document.getElementById('root')
);