import express from "express";
import Stripe from "stripe";
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { createCheckoutSession } from "../controllers/payment.controller.js";
import Appointment from "../models/appointment.model.js";
import asyncHandler from "../utils/asynHandler.js";

router.post("/", auth, createCheckoutSession);

// WEBHOOK 
router.post("/webhook", asyncHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {

        const session = event.data.object;
        const {
            userId,
            doctorId,
            date,
            startTime,
            endTime,
        } = session.metadata;

        const day = new Date(date).toLocaleDateString("en-US", {
            weekday: "long"
        });


        const findAppointment = await Appointment.findOne({
            doctorId: doctorId,
            date: date,
            startTime: startTime,
            endTime: endTime
        })
        if (findAppointment) {
            return res.status(200).json({
                message: 'Appointment already exist'
            })
        }

        const appointment = await Appointment.create({
            userId,
            doctorId,
            date,
            startTime,
            endTime,
            day,
            paymentMethod: "online",
        })
    }

    res.json({ received: true });
})



);

export default router; 