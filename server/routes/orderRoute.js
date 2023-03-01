import express from "express";
const router = express.Router();
import { addOrderItems, getMyOrders, getOrderByID, getOrders, updateOrderToDelivered, updateOrderToPaid } from '../controllers/orderController.js'
import { admin, protect } from "../middlewares/authMiddleware.js";


router.route('/myorders').get(protect, getMyOrders)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
router.route('/:id').get(protect, getOrderByID)
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)






export default router