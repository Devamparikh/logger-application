const express = require('express')
const app = express()

require('../src/db/mongoose')
require('../src/db/redis')
const userAuthentication = require('./user-authentication')

app.use(express.json())
app.use(userAuthentication)



const port = process.env.AUTHENTICATION_PORT 

app.listen(port, () => {
    console.log('server is running on port ', port)
})