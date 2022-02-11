const express = require('express')
const app = express()

require('../src/db/mongoose')
require('../src/db/redis')
require('./data-validator')

app.use(express.json())



const port = process.env.VALIDATOR_PORT || 3003

app.listen(port, () => {
    console.log('server is running on port ', port)
})