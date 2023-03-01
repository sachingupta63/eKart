import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'

//For Login
//@Route Post api/users/login public
const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    //Middle ware In userSchema
    if (user && (user.comparePassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmine: user.isAdmine,
            token: generateToken(user._id)
        })

    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }


})

//For Register
//@Route Post api/users/ public
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    const userExist = User.findOne({ email })

    if (!userExist) {
        res.status(400)
        throw new Error('User Already Exist')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmine: user.isAdmine,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Data')
    }


})
//For Getting profile
//@Route Get api/users/profile Privete
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmine: user.isAdmine,
        })

    } else {
        res.status(401)
        throw new Error('User not found')
    }


})
//For Updating profile
//@Route put api/users/profile Private
const updateUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmine: updatedUser.isAdmine,
            token: generateToken(updatedUser._id)
        })

    } else {
        res.status(401)
        throw new Error('User not found')
    }


})

//For Getting all user
//@Route Get api/users/profile Privete/admin
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find()
    res.json(users)



})

//For Deleting user
//@Route DELETE api/users/:id Privete/admin
const deletetUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({ message: "User Removed" })
    } else {
        res.status(404)
        throw new Error("User not found")




    }
})
//For get user by id
//@Route GET api/users/:id Privete/admin
const getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }



})

//For Update user
//@Route put api/users/:id Private/admin
const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmine = req.body.isAdmine
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmine: updatedUser.isAdmine,

        })

    } else {
        res.status(401)
        throw new Error('User not found')
    }


})


export { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deletetUser, getUserById, updateUser }
