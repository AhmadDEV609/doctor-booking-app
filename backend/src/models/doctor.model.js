import mongoose from "mongoose";


const doctor = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    speciality: {
        type: String
    },
    experience: {
        type: Number
    },
    fee: {
        type: Number
    },
    city: {
        type: String,
        required: true
    },
    license: {
        type: String
    },
    checkDuration: {
        type: Number,
        required: true
    },
    degreeImage: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    availability: [
        {
            day: {
                type: String
            },
            startTime: {
                type: String
            },
            endTime: {
                type: String
            }
        }
    ],
    approveStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true })


const Doctor = mongoose.model('Doctor', doctor)

export default Doctor