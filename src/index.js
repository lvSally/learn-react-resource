import React from './react';
import ReactDOM from 'react-dom';
let element = <h1 className="title" style={{color: 'red'}} key="1">hello</h1>
let element1 = React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  },
  key: "1"
}, "hello");
console.log(element1)
ReactDOM.render(
  element1,
  document.getElementById('root')
);