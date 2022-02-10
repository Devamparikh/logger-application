const express = require('express')
const router = new express.Router()
const Message = require('../src/models/message')
const auth = require('../src/middleware/auth')


router.post('/data-tracker', auth, async (req, res) => {
    // let type = typeof(req.body)
    // console.log(type)
    // console.log(req.body)
    // const array = req.body.toArray()
    // const user = new User(req.body)
    // userId: req.user._id
    req.body.forEach(element => {
        element.userId = req.user._id,
        element.requestId = req.header('CorrelationId')
    });

    try {
        const message = await Message.insertMany(req.body, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(400).send({error: error._message, ok: false})  
            }
            res.status(201).send({result: result, ok: true})
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({error: error, ok: false})
    }
})


router.get('/data-tracker/searchmsg',  async (req, res) => {
    
    try {
        const searchMsg = req.query.searchMsg
        if(!searchMsg){
            return res.send({message: 'search text required', ok: false})
        }
        const message = await Message.find({ "userMessage" : { $regex: searchMsg } }, {userMessage: 1})
        if(message.length < 1){
            return res.send({message: 'no data with this text', ok: true})
        }
        // console.log("message: ", message)
        res.send({message: message, ok: true})

    } catch (error) {
        console.log("e: ", error)
        res.status(400).send({error: error, ok: false})
    }
})


router.get('/data-tracker/category', auth, async (req, res) => {

    // console.log("seachmsg: ", searchMsg)
    try {
        const category = req.query.category
        const date = req.query.date
        const fromDate = new Date(date)
        const toDate = new Date(fromDate.getTime() + 86400000)
        if (!category || !date) {
            return res.send({message: 'category and date required.', ok: false})
        }

        const message = await Message.find({ "category" : category, "createdTime": {$gte: fromDate, $lt: toDate } }).count()
        if(message == 0){
            return res.send({message: 'no data with this category and date', ok: true})
        }
        // console.log("message: ", message)
        res.send({message: message, ok: true})

    } catch (error) {
        console.log("e: ", error)
        res.status(400).send({error: error, ok: false})
    }
})


module.exports = router
