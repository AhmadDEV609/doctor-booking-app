import { Router } from "express";
import { filters } from "../controllers/filter.controller.js";
import { getDoctorById } from "../controllers/filter.controller.js";
const filterRoutes = Router();

filterRoutes.get("/", filters);
filterRoutes.get('/:id', getDoctorById)

export default filterRoutes;