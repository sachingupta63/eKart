import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-Handler'
import User from "../models/userModel.js";

//authentication custom middleware
const protect = asyncHandler(async (req, res, next) => {

    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            token = req.headers.authorization.split(' ')[1]
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password') // manipulating request with setting req.user which will available to all handling route
            next()

        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }




})

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmine) {
        next()
    } else {
        res.status(401)
        throw new Error('Not Authorized as an admin')
    }

}

export { protect, admin }