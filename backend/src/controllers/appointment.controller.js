import asyncHandler from "../utils/asynHandler.js";
import Appointment from "../models/appointment.model.js";
import { validationResult } from "express-validator";
import Doctor from "../models/doctor.model.js";

const createAppointment = asyncHandler(async (req, res, next) => {

    const userId = req.user.id
    const { doctorId } = req.params
    const { date, startTime, endTime, paymentMethod } = req.body;
    const day = new Date(date).toLocaleDateString("en-US", {
        weekday: "long"
    });
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const err = new Error(error.array()[0].msg)
        err.status = 400
        return next(err)
    }

    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
        const err = new Error('doctor not found')
        err.status = 400
        return next(err)
    }

    const doctorCheck = doctor.availability.find((item) => {
        if (item.day === day && startTime >= item.startTime && endTime <= item.endTime) {
            return item
        }
    })
    if (!doctorCheck) {
        const err = new Error('doctor is not available')
        err.status = 400
        return next(err)
    }

    const findAppointment = await Appointment.findOne({
        doctorId: doctorId,
        date: date,
        startTime: startTime,
        endTime: endTime
    })
    if (findAppointment) {
        const err = new Error('appointment already exist')
        err.status = 400
        return next(err)
    }
    const appointment = await Appointment.create({
        userId,
        doctorId,
        date,
        startTime,
        endTime,
        day,
        paymentMethod
    });
    res.status(200).json({
        message: 'Appointment created successfully',
        appointment
    })

})

//this is for user

const getUserAppointments = asyncHandler(async (req, res, next) => {
    const appointments = await Appointment.find({ userId: req.user.id }).populate({
        path: "doctorId",
        populate: {
            path: "userId"
        }
    })
        .populate("userId");
    res.status(200).json({
        message: 'Appointments fetched successfully',
        appointments
    })
})


//this is for admin 
const getAppointments = asyncHandler(async (req, res, next) => {
    const appointments = await Appointment.find()
        .populate({
            path: "doctorId",
            populate: {
                path: "userId"
            }
        })
        .populate("userId");
    res.status(200).json({
        message: 'Appointments fetched successfully',
        appointments
    })
})


const updateAppointment = asyncHandler(async (req, res, next) => {
    const { appointmentId } = req.params
    const { status } = req.body
    const update = await Appointment.findOneAndUpdate(
        { _id: appointmentId },
        { status: status },
        { new: true }
    )
    res.status(200).json({
        message: 'Status updated successfully',
        update
    })
})


export { createAppointment, getAppointments, getUserAppointments, updateAppointment }



