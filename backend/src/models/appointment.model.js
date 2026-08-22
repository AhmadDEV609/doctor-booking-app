import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        day: {
            type: String
        },
        date: {
            type: String,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "online"],
            default: "cash"
        },
        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "completed",
                "cancelled",
            ],
            default: "pending",
        }
    },
    {
        timestamps: true,
    }
);


appointmentSchema.index(
    {
        doctorId: 1,
        day: 1,
        startTime: 1,
        endTime: 1,
    },
    {
        unique: true,
    }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;