import { Router } from "express";
import upload from '../middlewares/multer.middleware.js'
import { signup, login, uploaddocumentImage, doctorupdateProfile, userUpdate, userimageUpdate, getDoctorProfile, getUser, logout } from "../controllers/user.controller.js";
import { signupValidator, loginValidator } from "../validator/user.validate.js";
import { auth } from "../middlewares/auth.middleware.js";
import { generateNewToken } from "../middlewares/auth.middleware.js";
const userRoutes = Router();

userRoutes.post('/signup', upload.single('image'), signupValidator, signup)
userRoutes.post('/login', loginValidator, login)
userRoutes.post('/uploaddocumentImage', auth, upload.single('degreeImage'), uploaddocumentImage)
userRoutes.patch('/doctorupdateProfile', auth, doctorupdateProfile)
userRoutes.get('/getUser', auth, getUser)
userRoutes.post('/refreshToken', generateNewToken)
userRoutes.get(
    "/myDoctorProfile",
    auth,
    getDoctorProfile
);
userRoutes.post(
    "/logout",
    auth,
    logout
);



export default userRoutes