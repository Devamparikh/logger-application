const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    },
    userMessage: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        // validate(value) {
        //     if ((value !== 'Retried') || (value !== 'Direct') || (value !== 'Failed')) {
        //         throw new Error('Invalid value for category')
        //     }
        // }

    },
    requestId: {
        type: String,
        // required: true
    },
    createdTime: {
        type: Date,
        default: new Date()
    }

})
const Message = mongoose.model('Message', messageSchema)

module.exports = Message