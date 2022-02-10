const express = require('express')
const app = express()

require('../src/db/mongoose')
const client = require('../src/db/redis')
client()
const userAuthentication = require('./user-authentication')

app.use(express.json())
app.use(userAuthentication)



const port = process.env.AUTHENTICATION_PORT || 3001

app.listen(port, () => {
    console.log('server is running on port ', port)
})