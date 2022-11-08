import React from 'react';
import ReactDOM from 'react-dom';

class Mouse extends React.Component{
  state = {
    x: -1,
    y: -1
  }
  moveFn = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    })
  }

  render () {
    return <div onMouseMove={this.moveFn} style={{border: '1px solid #000'}}>move: {this.props.children(this.state)}</div>
  }
}

class Parent extends React.Component{
  
  render () {
    return <div>
      <Mouse>
        {({x, y}) => <div>xxoo, {x}, {y}</div>}
      </Mouse>
    </div>
  }
}
ReactDOM.render(
  <Parent/>,
  document.getElementById('root')
);