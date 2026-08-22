import Doctor from '../models/doctor.model.js'
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { doctorId, date, startTime, endTime } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const doctor = await Doctor.findById({ _id: doctorId }).populate('userId');

        if (!doctor) {
            return res.status(404).json({ message: "doctor not found" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",

            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Appointment with Dr. ${doctor.userId.name}`,
                        },
                        unit_amount: Math.round(doctor.fee * 100),
                    },
                    quantity: 1,
                },
            ],

            metadata: {
                userId: userId.toString(),
                doctorId: doctorId.toString(),
                date: date,
                startTime: startTime,
                endTime: endTime
            },

            success_url: `${process.env.CLIENT_URL}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ url: session.url });

    } catch (error) {
        console.log("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
};