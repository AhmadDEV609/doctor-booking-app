import User from "../models/user.model.js";
import asyncHandler from "../utils/asynHandler.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import generateTokens from "../helper/generateTokens.helper.js";
import Doctor from "../models/doctor.model.js";
import fs from 'fs'
import cloudinary from '../utils/cloudinary.js';
import { validationResult } from "express-validator";

const signup = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body
    const image = req.file
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg)
        err.status = 400
        return next(err)
    }
    const findUser = await User.findOne({ email })
    if (findUser) {
        const err = new Error('User already exist')
        err.status = 400
        return next(err)
    }

    const hashPassword = await bcrypt.hash(password, 10)




    const user = await User.create({
        name,
        email,
        password: hashPassword,
        image: '',
        role: role,
        public_id: ''
    })

    res.status(201).json({
        success: true,
        user
    })

    setImmediate(async () => {
        try {
            const result = await cloudinary.uploader.upload(image.path, {
                folder: "user_image",
                resource_type: "image",
            });

            await User.findByIdAndUpdate(user._id, {
                image: result.secure_url,
                public_id: result.public_id
            });

        } catch (err) {
            console.error("Image upload failed:", err);
        } finally {
            if (image?.path && fs.existsSync(image.path)) {
                fs.unlinkSync(image.path);
            }
        }
    });

})


const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg)
        err.status = 400
        return next(err)
    }
    const user = await User.findOne({ email })
    if (!user) {
        const err = new Error('User not found')
        err.status = 400
        return next(err)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        const err = new Error('Invalid credentials')
        err.status = 400
        return next(err)
    }

    const { accessToken, refreshToken } = generateTokens(user)

    user.refreshToken = refreshToken
    await user.save()

    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 15,
        httpOnly: true
    })
    res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        user,
        role: user.role
    })
})


const userUpdate = asyncHandler(async (req, res, next) => {

    const { name, email, bio, city, phone } = req.body
    const update = await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
            name,
            email,
            bio,
            city,
            phone
        },
        { new: true }
    )
    res.status(200).json({
        message: 'User profile updated successfully',
        update
    })
})

const userimageUpdate = asyncHandler(async (req, res, next) => {
    const user = await User.findById({ _id: req.user.id })
    const image = req.file
    if (!user) {
        const err = new Error('User not found')
        err.status = 400
        return next(err)
    }

    const result = await cloudinary.uploader.upload(
        image.path,
        {
            folder: 'user_image',
            resource_type: 'image'
        }
    )
    fs.unlinkSync(image.path)

    const destroy = await cloudinary.uploader.destroy(user.image)

    const update = await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
            image: result.secure_url
        },
        { new: true }
    )
    res.status(200).json({
        message: 'User profile updated successfully',
        update
    })

})

const logout = asyncHandler(async (req, res) => {

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    await User.findByIdAndUpdate(req.user.id, {
        refreshToken: ""
    });

    res.status(200).json({
        message: "Logout Successfully"
    });

});

const doctorupdateProfile = asyncHandler(async (req, res, next) => {
    const { speciality, experience, fee, license, availability, checkDuration, city } = req.body
    const user = await User.findById(req.user.id)
    if (user.role == 'doctor') {
        const updateData = await Doctor.findOneAndUpdate(
            { userId: req.user.id },
            {
                speciality,
                experience,
                fee,
                license,
                availability,
                checkDuration,
                city
            },
            { new: true, upsert: true }
        )


    } else {
        const err = new Error('You are not a doctor')
        err.status = 400
        return next(err)
    }

    res.status(200).json({
        message: 'doctor profile updated successfully',
    })


})

const uploaddocumentImage = asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.findOne({ userId: req.user.id })
    const user = await User.findById(req.user.id)
    const documentImage = req.file
    let result;
    if (user.role == 'doctor') {
        result = await cloudinary.uploader.upload(
            documentImage.path,
            {
                folder: 'Doctor_Document_Image',
                resource_type: 'image'
            }
        )
        doctor.degreeImage = result.secure_url
        await doctor.save()
        fs.unlinkSync(documentImage.path)
    }
    res.status(200).json({
        message: 'Doctor document image uploaded successfully',
        documentImage: result.secure_url
    })
})

const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user) {
        const err = new Error('user is not found')
        err.status = 404
        return next(err)
    }
    res.status(200).json({
        user
    })


})




const getDoctorProfile = asyncHandler(async (req, res, next) => {

    const doctor = await Doctor.findOne({
        userId: req.user.id
    });

    if (!doctor) {

        return res.status(200).json({
            doctor: null
        });

    }

    res.status(200).json({
        doctor
    });

});


export { signup, login, uploaddocumentImage, doctorupdateProfile, userUpdate, userimageUpdate, getUser, logout, getDoctorProfile }
