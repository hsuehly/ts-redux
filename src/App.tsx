import React from 'react'
import { Count } from './view/Count'
import  CountComponent  from './view/Count.class'


function App() {

  return (
    <div className="App">
      <Count />
     <hr />
     <CountComponent sname={"hsueh"}/>
    </div>
  )
}

export default App
