import { Router } from "express";
import {
    createAppointment,
    getAppointments,
    getUserAppointments,
    updateAppointment
} from "../controllers/appointment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const appointmentRoutes = Router();


appointmentRoutes.post(
    "/:doctorId",
    auth,
    createAppointment
);


appointmentRoutes.get(
    "/",
    auth,
    getAppointments
);


appointmentRoutes.get(
    "/my",
    auth,
    getUserAppointments
);


appointmentRoutes.patch(
    "/:appointmentId",
    updateAppointment
);


export default appointmentRoutes;