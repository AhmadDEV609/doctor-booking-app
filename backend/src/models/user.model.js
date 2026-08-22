import mongoose from "mongoose";


const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'patient', 'doctor'],
        required: true,
        default: 'patient'
    },
    public_id: {
        type: String
    },
    refreshToken: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: false
    },
    bio: {
        type: String
    },
    city: {
        type: String
    },
    phone: {
        type: Number
    },
}, { timestamps: true })


const User = mongoose.model('User', user)

export default User