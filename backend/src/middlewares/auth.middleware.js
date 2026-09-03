import asyncHandler from "../utils/asynHandler.js";
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js";
import generateTokens from "../helper/generateTokens.helper.js";

const auth = asyncHandler((req, res, next) => {
    const token = req.cookies?.accessToken
    if (!token) {
        const err = new Error('token is not found')
        err.status = 401
        return next(err)
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    if (decode) {
        req.user = decode
        next()
    }
})

const generateNewToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
        const err = new Error('token is not found')
        err.status = 401
        return next(err)
    }
    const decode = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET)
    const user = await User.findById(decode.id)
    if (!user) {
        const err = new Error('user is not found')
        err.status = 401
        return next(err)
    }
    if (user.refreshToken !== refreshToken) {
        const err = new Error('token is not found')
        err.status = 401
        return next(err)
    }

    const { accessToken } = generateTokens(user)

    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

    res.status(200).json({
        message: 'token is updated',
    })

})

export { auth, generateNewToken }
