import React from 'react';
import ReactDOM from 'react-dom';

class Mouse extends React.Component{
  
  render () {
    return <div style={{border: '1px solid #000'}}>
      child-out
      {console.log(document.querySelector('#child'))}
      {document.querySelector('#child') && ReactDOM.createPortal(<div>child from portal</div>, document.querySelector('#child'))}
    </div>
  }
}

class Parent extends React.Component{
  state = {
    num: -1
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({num: 1})
    })
  }
  render () {
    return <div>
      <div>parent</div>
      <div id="child"></div>
      {this.state.num===1 && <Mouse/>}
    </div>
  }
}
ReactDOM.render(
  <Parent/>,
  document.getElementById('root')
);