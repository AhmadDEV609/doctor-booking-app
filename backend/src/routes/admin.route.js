import { Router } from "express";
import {
    getDoctors,
    updateStatus,

} from "../controllers/admin.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import roleCheck from "../middlewares/rolecheck.middleware.js";
const adminRoutes = Router();


adminRoutes.get(
    "/doctors",
    auth,
    roleCheck,
    getDoctors
);


adminRoutes.patch(
    "/doctors/:doctorId/status",
    auth,
    roleCheck,
    updateStatus
);


export default adminRoutes;