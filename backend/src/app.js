import express from "express";
import cors from "cors";
import { error } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
const app = express();


app.use(cors({
    origin: true,
    credentials: true
}));

app.use(
    "/api/v1/payment/webhook",
    express.raw({
        type: "application/json",
    })
);


app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.use(cookieParser());


// Routes
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import filterRoutes from "./routes/filter.route.js";
import router from "./routes/payment.route.js";

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/appointments", appointmentRoutes);

app.use("/api/v1/filter", filterRoutes);

app.use('/api/v1/payment', router);

app.use(error);


export default app;