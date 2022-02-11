const express = require('express')
const app = express()

require('../src/db/mongoose')
require('../src/db/redis')

const dataTracker = require('./data-tracker')

app.use(express.json())
app.use(dataTracker)



const port = process.env.TRACKER_PORT || 3000

app.listen(port, () => {
    console.log('server is running on port ', port)
})