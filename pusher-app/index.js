const express = require('express')
const app = express()

require('../src/db/mongoose')
require('../src/db/redis')
const dataPusher = require('./data-pusher')

app.use(express.json())
app.use(dataPusher)



const port = process.env.PUSHER_PORT || 3002

app.listen(port, () => {
    console.log('server is running on port ', port)
})