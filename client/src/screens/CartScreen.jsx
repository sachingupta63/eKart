import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartAction'


const CartScreen = (props) => {

    const navigate = useNavigate()

    const param = useParams()
    const productId = param.id
    const queryParams = new URLSearchParams(window.location.search)
    const qty = queryParams.get('qty') ? Number(queryParams.get('qty')) : 1

    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }

    }, [dispatch, productId, qty, userInfo])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        if (!userInfo) {
            navigate('/login')
        } else {
            navigate('/shipping')
        }

    }





    return (
        <Row>
            <Col md={8}>
                <h1> Shopping Cart</h1>
                {cartItems.length === 0 ? <Message>Your Cart Is Empty <Link to='/'>Go Back</Link></Message> : (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded></Image>
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}><i class="fa fa-inr"></i>{item.price}</Col>
                                    <Col md={2}>
                                        <Form.Control className='p-1' as='select' value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1} className='text-center'>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button type='button' variant='light' onClick={() => {
                                            removeFromCartHandler(item.product)
                                        }}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>

                            </ListGroup.Item>
                        ))}

                    </ListGroup>
                )}

            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                            <i class="fa fa-inr"></i>{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                        <ListGroup.Item className='text-center'>
                            <Button type='button' className='btn-black' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                Proceed to Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>

            </Col>

        </Row>
    )
}

export default CartScreen
