import asyncHandler from "../utils/asynHandler.js";
import Doctor from "../models/doctor.model.js";

const getDoctors = asyncHandler(async (req, res, next) => {

    const doctors = await Doctor.find({})
        .populate(
            "userId",
            "name email image bio city phone"
        )
        .sort({ createdAt: -1 });

    if (doctors.length === 0) {
        const err = new Error("Doctors not found");
        err.status = 404;
        return next(err);
    }

    res.status(200).json({
        success: true,
        message: "Doctors fetched successfully",
        doctors
    });

});

const updateStatus = asyncHandler(async (req, res, next) => {

    const { doctorId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "pending",
        "approved",
        "rejected"
    ];

    if (!allowedStatuses.includes(status)) {
        const err = new Error("Invalid approval status");
        err.status = 400;
        return next(err);
    }

    const update = await Doctor.findOneAndUpdate(
        {
            userId: doctorId
        },
        {
            approveStatus: status
        },
        {
            new: true
        }
    );

    if (!update) {
        const err = new Error("Doctor profile not found");
        err.status = 404;
        return next(err);
    }

    res.status(200).json({
        success: true,
        message: "Doctor status updated successfully",
        update
    });

});



export { updateStatus, getDoctors }