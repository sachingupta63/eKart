import Order from "../models/orderModel.js";
import asyncHandler from 'express-async-handler'

//@Route POST api/orders/ private
export const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')

    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })

        const creaedOrder = await order.save()

        res.status(201).json(creaedOrder)

    }
})

//@Route GET api/orders/:id private
export const getOrderByID = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
        res.status(201)
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})
//@Route PUT api/orders/:id/pay private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {     //Come From Paypal
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address


        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

//@Route PUT api/orders/:id/deliver private/admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        res.json(updatedOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

//@Route GET api/orders/myorders private
export const getMyOrders = asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id })
    res.json(order)

})

//@Route GET api/orders/orders private
export const getOrders = asyncHandler(async (req, res) => {
    const order = await Order.find().populate('user', 'id name')
    res.json(order)

})

