import React from 'react';
import ReactDOM from 'react-dom';

class CustomButton extends React.Component{
  render () {
    return <button className="aaa">{this.props.title}111</button>
  }
}

function HComponent(Component) {
  return class extends CustomButton {
    state={
      num: 0
    }
    clickFn = () => {
      this.setState({
        num: this.state.num + 1
      })
    }
    render() {
      let superElement = super.render()
      let newProps = {
        onClick: this.clickFn
      }
      return React.cloneElement(superElement, newProps, this.state.num)
    }
  }
}

const Element = HComponent(CustomButton)
ReactDOM.render(
  <Element/>,
  document.getElementById('root')
);