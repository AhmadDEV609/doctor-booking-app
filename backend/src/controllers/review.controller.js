import Reviews from "../models/review.model.js";
import asyncHandler from "../utils/asynHandler.js";

const addComment = asyncHandler(async (req, res, next) => {
    const { comment } = req.body
    const doctorId = req.params.id
    const userId = req.user.id
    const Review = await Reviews.create({
        userId,
        doctorId,
        comment
    })
    res.status(200).json({
        message: 'Review added successfully',
        Review
    })
})

const getComments = asyncHandler(async (req, res, next) => {
    const comments = await Reviews.find({ doctorId: req.params.id }).populate('userId')
    res.status(200).json({
        message: 'Reviews fetched successfully',
        comments
    })
})



const deleteComment = asyncHandler(async (req, res, next) => {
    const deleted = await Reviews.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
    })
    res.status(200).json({
        message: 'Review deleted successfully',
        deleted
    })
})






export { addComment } 