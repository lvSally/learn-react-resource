import React from './react';
import ReactDOM from './react-dom';

let ColorTheme = React.createContext()

class Header extends React.Component {
  render() {
    return <ColorTheme.Consumer>
      {({color, setColorFn}) => <div style={{height: 100, with: 300, border: `4px solid ${color}` }}>
        header
        <button onClick={() => setColorFn('black')}>变黑</button>
        <button onClick={() => setColorFn('red')}>变红</button>
      </div>}
      
    </ColorTheme.Consumer>
  }
}

class Main extends React.Component {
  static contextType = ColorTheme
  render() {
    return <div style={{height: 300, with: 300, border: `4px solid ${this.context.color}` }}>
      main
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
    console.log(color)
    this.setState({
      color
    })
  }
  render() {
    let {color} = this.state
    let context = {setColorFn: this.setColorFn, color}
    console.log(color, 'inner')

    return <ColorTheme.Provider value={context}>
      <div style={{height: 500, with: 500, border: `4px solid ${color}` }}>
        {color}
        <Header></Header>
        <Main></Main>
      </div>
    </ColorTheme.Provider>
  }
}
const element = <Parent />
// const element = <div a='bbb'>133</div>

ReactDOM.render(
  element,
  document.getElementById('root')
);