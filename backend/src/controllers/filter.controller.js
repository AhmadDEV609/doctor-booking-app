import asyncHandler from "../utils/asynHandler.js";
import Doctor from "../models/doctor.model.js";

const filters = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const speciality = req.query.speciality || "";

    const skip = (page - 1) * limit;

    const filter = {
        approveStatus: "approved"
    };

    if (speciality) {
        filter.speciality = speciality;
    }

    const totalDoctor = await Doctor.countDocuments(filter);

    const totalPages = Math.ceil(totalDoctor / limit);

    const doctors = await Doctor.find(filter)
        .populate(
            "userId",
            "name email image bio city phone"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({

        success: true,

        message: "Doctors fetched successfully",

        doctors,

        pagination: {
            currentPage: page,
            totalDoctor,
            totalPages,
            limit
        }

    });

});


const getDoctorById = asyncHandler(async (req, res, next) => {

    const { id } = req.params;

    const doctor = await Doctor.findOne({
        _id: id,
        approveStatus: "approved"
    }).populate(
        "userId",
        "name email image bio city phone"
    );

    if (!doctor) {
        const err = new Error("Doctor not found");
        err.status = 404;
        return next(err);
    }

    res.status(200).json({
        success: true,
        message: "Doctor fetched successfully",
        doctor
    });
});

export { filters, getDoctorById };