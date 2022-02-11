const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const {createClient} = require('redis')
const client = require('../db/redis')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        index: {unique: true, dropDups: true},
        required: true,
        minlength: 5,
        maxlength: 15,
        trim: true,
        // dropDups: true,
        validate(value) {
            var myRegxp = /^([a-zA-Z0-9_-]){5,15}$/;
            if (!myRegxp.test(value)) {
              throw new Error('Username should be between 5 to 15 characters long and only alphanumeric is allowed')
            }
          },
    },
    password: {
        type: 'string',
        required: true,
        trim: true,
        minlength: 6,
        // maxlength: 12,
        // validate(value) {
        //     if(value.toLowerCase().includes('password')){
        //         throw new Error('Password cant be password')
        //     }
        // }
    },
    
}, {
    timestamps: true
})


userSchema.virtual('messages', {
    ref: 'Message', 
    localField: '_id',
    foreignField: 'userId'
})


userSchema.methods.generateAuthToken = async function(user) {
    // const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    // user.tokens = user.tokens.concat({token})
    // await user.save()
    return token
}


userSchema.statics.findByCredentials = async (username, password) => {

    // const client = createClient({
    //     url: process.env.REDIS_URL
    //   })
    
    // client.on('error', (err) => console.log('Redis Client Error', err))
    
    // await client.connect()
    findKey = 'user_' + username
    const value = await client.json.get(findKey)
    console.log("value: ", value)

    if(!value){
        throw new Error('no such Credentials exits on db')
    }
    const isMatch = await bcrypt.compare(password, value.password)
    if(!isMatch) {
        throw new Error('Invalid password')
    }


    // const value = await client.sendCommand(['keys', '*'])
    // console.log("value: ", value)

    
    // const userID = value.map(async (element) => {
    //     console.log("element: ", element)
    //     const jsonObject = await client.json.get(element)
    //     console.log("json: ",jsonObject)
    //     if (jsonObject.username === username) {
    //         const isMatch = await bcrypt.compare(password, jsonObject.password)
    //         if(!isMatch) {
    //             throw new Error('Invalid password')
    //         }
    //         return jsonObject.id
    //     }
    // })



    // const IDS = await userID
    // console.log(userID.toString)
    // console.log(IDS)
    const user = await User.findById(value.id)
    if(!user) {
        throw new Error('Unable to login.') 
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('User', userSchema )

module.exports = User