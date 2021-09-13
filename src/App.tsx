import React from 'react'
import { Count } from './view/Count'
import  CountComponent  from './view/Count.class'
// rtk
import { RtkCount } from './view/RtkCount'
import RtkCountClass from './view/RtkCount.class'

function App() {

  return (
    <div className="App">
      <Count uname={"hsueh"}/>
     <hr />
     <CountComponent sname={"hsueh"}/>
     <hr />
     <p>RTK</p>
     <RtkCount/>
     <RtkCountClass/>

    </div>
  )
}

export default App
