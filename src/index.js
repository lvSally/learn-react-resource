import React from './react';
import ReactDOM from './react-dom';


class Three extends React.Component {
  render() {
    return <div>three: {this.props.num}</div>
  }
}

function Tow(props) {
  return <Three {...props}/>
}

class One extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 0
    }
  }

  render() {
    return <Tow num={this.props.num}/>
  }
}
const element = <One />

ReactDOM.render(
  element,
  document.getElementById('root')
);