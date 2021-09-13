const express = require('express')

const app = express()

app.get('/data',(req,res)=>{
  res.send({
    name: 'hsueh',
    phone: 17623232386+ (Math.floor(Math.random()*10000000)),
    date: new Date()
  })
})

app.listen(3001,()=> {
  console.log("server is running")
})

