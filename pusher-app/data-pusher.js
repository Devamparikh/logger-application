const express = require('express')
const amqp = require('amqplib')
// const {createClient} = require('redis');
const client = require('../src/db/redis')
const router = new express.Router()
// const Message = require('../src/models/message')
const auth = require('../src/middleware/auth')



router.post('/data-pusher', auth, async (req, res) => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')
        const channel = await connection.createChannel()
        const QUEUE = 'dataValidator'
        const randomNumber = Math.floor(Math.random() * (60 - 1 + 1) + 1)



        const msg = []
        req.body.forEach(element => {
            msg.push({id: req.user._id, username: req.user.username, message: element.message, randomNumber: randomNumber, token: req.token})
        });
        console.log(msg)



        // const msg = {id: req.user._id, username: req.user.username, message: req.body.message, randomNumber: randomNumber, token: req.token}
        const result = await channel.assertQueue(QUEUE)
        const sendToQueueResult = await channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)))
        console.log("send" ,sendToQueueResult)
        if (sendToQueueResult) {

            userKey = 'user_' + req.user.username
            await client.json.NUMINCRBY(userKey, ".requestCounter", 1);
            const value = await client.json.get(userKey)
            console.log("value: ", value)
            res.status(200).send({message: 'data send to queue successful.', ok: true})
        }else{
            res.status(400).send({message: 'no data send to queue!', ok: false})
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({error: error, ok: false})
    }
})





module.exports = router