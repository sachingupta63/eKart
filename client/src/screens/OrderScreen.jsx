import React, { useEffect, useState, } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'
import { deliverOrder, getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstant'

const OrderScreen = () => {

    const navigate = useNavigate()

    const { id } = useParams()

    const [sdkReady, setSdkReady] = useState(false)


    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver


    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    if (!loading) {
        order.itemsPrice = Number(order.orderItems.reduce((acc, item) => acc + (item.qty * item.price), 0)).toFixed(2)
    }


    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }

        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get(`https://ekart-a2gt.onrender.com/api/config/paypal`)
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if (!order || successPay || successDeliver) {
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch({ type: ORDER_PAY_RESET })
            dispatch(getOrderDetails(id))

        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }

        }
    }, [dispatch, id, order, successPay, successDeliver, navigate, userInfo])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(id, paymentResult))

    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }



    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p> <strong>Name: </strong>{order.user.name}</p>
                        <p> <strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p>
                            <strong>Address</strong>{' : '}
                            {order.shippingAddress.address},{order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode},{' '}
                            {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (<Message variant='success'>Delivered on {new Date(order.deliveredAt).toLocaleString('en-GB')}</Message>) : (<Message variant='danger'>Not Delivered</Message>)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method : </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (<Message variant='success'>Paid on {new Date(order.paidAt).toLocaleString("en-GB")}</Message>) : (<Message variant='danger'>Not Paid</Message>)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Item</h2>
                        {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link style={{ textDecoration: 'none' }} to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty}x<i class="fa fa-inr"> </i>{item.price}=<i class="fa fa-inr"></i>{(item.qty * item.price).toFixed(2)}

                                            </Col>
                                        </Row>

                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col><i class="fa fa-inr"></i> {order.itemsPrice}</Col>
                            </Row>

                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col><i class="fa fa-inr"></i> {order.shippingPrice}</Col>
                            </Row>

                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col><i class="fa fa-inr"></i> {order.taxPrice}</Col>
                            </Row>

                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col><i class="fa fa-inr"></i> {order.totalPrice}</Col>
                            </Row>

                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader />}
                                {!sdkReady ? <Loader /> : (
                                    <PayPalButton amount={order.totalPrice}
                                        onSuccess={successPaymentHandler} />
                                )}
                            </ListGroup.Item>
                        )}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmine && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type='button' className='btn btn-black btn-block' onClick={deliverHandler}>
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}

                    </ListGroup>
                </Card>

            </Col>

        </Row>
    </>

}

export default OrderScreen
