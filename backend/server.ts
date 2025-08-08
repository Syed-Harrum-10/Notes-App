const express = require('express')
const app = express()
const route = require('./routes/auth')
const port = 5000

app.use('/', route)

app.listen(port, ()=>{
    console.log(`server is runing at ${port}`)
})