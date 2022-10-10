import React from 'react';
import ReactDOM from 'react-dom';

let ColorTheme = React.createContext()
console.log(ColorTheme)

class Header extends React.Component {
  render() {
    return <ColorTheme.Consumer>
      {({color}) => <div style={{height: 100, with: 300, border: `4px solid ${color}` }}></div>}
      
    </ColorTheme.Consumer>
  }
}

class Main extends React.Component {
  static contextType = ColorTheme
  render() {
    return <div style={{height: 300, with: 300, border: `4px solid ${this.context.color}` }}>
      <button onClick={() => this.context.setColorFn('black')}>变黑</button>
      <button onClick={() => this.context.setColorFn('red')}>变红</button>
    </div>
  }
}

class Parent extends React.Component {
  state = {
    color: 'red'
  }
  setColorFn = (color) => {
    this.setState({
      color
    })
  }
  render() {
    let {color} = this.state
    let context = {setColorFn: this.setColorFn, color}
    return <ColorTheme.Provider value={context}>
      <div style={{height: 500, with: 500, border: `4px solid ${color}` }}>
        <Header></Header>
        <Main></Main>
      </div>
    </ColorTheme.Provider>
  }
}
const element = <Parent />

ReactDOM.render(
  element,
  document.getElementById('root')
);