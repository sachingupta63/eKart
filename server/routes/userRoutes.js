import express from "express";
const router = express.Router();
import { authUser, deletetUser, getUserById, getUserProfile, getUsers, registerUser, updateUser, updateUserProfile } from '../controllers/userController.js'
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route('/').post(registerUser).get(protect, admin, getUsers) //Two Middleware one after another
router.route('/login').post(authUser)
router.route('/profile').get(protect, getUserProfile)
router.route('/profile').put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deletetUser).get(protect, admin, getUserById).put(protect, admin, updateUser)


export default router