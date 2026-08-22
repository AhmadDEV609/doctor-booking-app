import { body } from "express-validator";


export const appointmentValidator = [

    body("doctorId")
        .notEmpty()
        .withMessage("Doctor id required")
        .isMongoId()
        .withMessage("Invalid doctor id"),


    body("day")
        .notEmpty()
        .withMessage("Day required"),


    body("startTime")
        .notEmpty()
        .withMessage("Start time required"),


    body("endTime")
        .notEmpty()
        .withMessage("End time required")

];