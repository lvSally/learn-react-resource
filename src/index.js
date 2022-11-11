import React from 'react';
import ReactDOM from 'react-dom';

// ------- not use memo --------
// function Child() {
//   console.log(111)
//   return <div>Child</div>
// }

// function Parent() {
//   const [num, setNum] = React.useState(0)
//   const [txt, setTxt] = React.useState('xx')

//   let handlerFn = () => {
//     setNum(num+1)
//   }
//   return <div>
//     <div>parent: <input value={txt} onChange={(e) => {
//       setTxt(e.target.value)
//     }} /></div>
//     <Child data={num} handler={handlerFn} />
//   </div>
// }

// ----------------------------
// 1 使用React.memo阻止没有state依赖的组件更新
// 2 但是如果有state依赖，进一步阻止更新需要使用 React.useCallback, React.useMemo


function Child(props) {
  console.log('child update')
  return <div>
    Child: {props.data} 
    <div onClick={props.handler}>+</div>
  </div>
}

const ChildUseMemo = React.memo(Child)

function Parent() {
  const [num, setNum] = React.useState(0)
  const [txt, setTxt] = React.useState('xx')

  const handlerFn = React.useCallback(() => {
    setNum(num+1)
  }, [num])

  // const handlerFn = () => {
  //   setNum(num+1)
  // }

  const dataUseMemo = React.useMemo(() => num, [num])
  return <div>
    <div>parent: <input value={txt} onChange={(e) => {
      setTxt(e.target.value)
    }} /></div>
    <ChildUseMemo data={dataUseMemo} handler={handlerFn} />
  </div>
}

ReactDOM.render(
  <Parent/>,
  document.getElementById('root')
);