import React from './react';
import ReactDOM from './react-dom';

function UseReducer() {
  let reducer = (state, action) => {
    switch(action) {
      case 'add':
        return {num: state.num + 1}
      case 'minus':
        return {num: state.num - 1}
      default:
        return state.num
    }
  }
  const [state, dispatch] = React.useReducer(reducer, {num: 0})
  return <div>
    <div>A:{state.num}</div>
    <div onClick={() => dispatch('add')}>+</div>
    <div onClick={() => dispatch('minus')}>-</div>
  </div>
}

ReactDOM.render(
  <UseReducer/>,
  document.getElementById('root')
);