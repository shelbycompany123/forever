import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    }
})

const commentModel = mongoose.models.comment || mongoose.model('comment', commentSchema);

export default commentModel;