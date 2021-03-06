const express = require('express')
// const amqp = require('amqplib')
// const auth = require('../src/middleware/auth')
const client = require('../src/db/redis')
const User = require('../src/models/user')
// const client = require('../db/redis')
const router = new express.Router()




router.post('/user/register', async (req, res) => {
    if(!req.body.password){
        return res.status(400).send({error: 'password required',  ok:false})
    }
    if(req.body.password.length > 12){
        return res.status(400).send({error: 'Password cant be of length 12+',  ok:false})
    }
    
    // console.log(user)

    try {
        const user = await new User(req.body)
        console.log(user)
        if (!user) {
            throw new Error('username already present in db')
        }
        const userAfterSave = await user.save()
        console.log("userAfterSave: ", userAfterSave)

        if (!userAfterSave) {
            throw new Error('username already present in db')
        }
        console.log(userAfterSave)
        // const client = createClient({
        //     url: process.env.REDIS_URL
        //   })
        
        // client.on('error', (err) => console.log('Redis Client Error', err))
        // await client.connect()
        

        // const TEST_KEY = 'user_6200dc6ba0fb7ed26adc9383'
        const userKey = 'user_' + userAfterSave.username
        // console.log(userKey)
        await client.json.set(userKey, '.', { id:userAfterSave._id, username: userAfterSave.username, password: userAfterSave.password, requestCounter: 0 });
        // const value = await client.json.mget()
        // await client.sendCommand(['flushall'])
        // const value = await client.sendCommand(['keys', '*'])

        // console.log(value);


        const token = await user.generateAuthToken(userAfterSave)
        res.status(201).send({user, token, 'ok':true})
    } catch (error) {
        console.log(error)
        res.status(400).send({error: error._message, ok:false})
    }
})

router.post('/user/login', async (req, res) => {

    try {
        console.log("request start")
        const user = await User.findByCredentials(req.body.username, req.body.password)
        console.log("user: ", user)
        const token = await user.generateAuthToken(user)
        console.log("token: ", token)
        res.status(200).send({user, token, 'ok':true})
    } catch (error) {
        console.log(error.message)
        res.status(400).send({error: error.message, ok: false})
    }
})





module.exports = router