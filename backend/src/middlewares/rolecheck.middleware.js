import asyncHandler from "../utils/asynHandler.js";
import jwt from 'jsonwebtoken'



const roleCheck = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken
    if (!token) {
        const err = new Error('token is not found')
        err.status = 401
        return next(err)
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET)
    if (decode.role == 'admin') {
        req.user = decode
        next()
    }
})



export default roleCheck