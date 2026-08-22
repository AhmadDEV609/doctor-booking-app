import { Router } from "express";
import {
    getDoctors,
    updateStatus,

} from "../controllers/admin.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const adminRoutes = Router();


adminRoutes.get(
    "/doctors",
    auth,
    getDoctors
);


adminRoutes.patch(
    "/doctors/:doctorId/status",
    auth,
    updateStatus
);


export default adminRoutes;