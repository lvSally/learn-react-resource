import React from 'react';
import ReactDOM from 'react-dom';

class Children extends React.Component{
  render () {
    return <div>
      <div onClick={this.props.show}>show</div>
      <div onClick={this.props.hide}>hide</div>
    </div>
  }
}

function HComponent(Component) {
  return class extends React.Component {
    state={
      show: () => console.log('show'),
      hide: () => console.log('hide')
    }
    render() {
      return <Component {...this.state} />
    }
  }
}

const Element = HComponent(Children)
ReactDOM.render(
  <Element/>,
  document.getElementById('root')
);