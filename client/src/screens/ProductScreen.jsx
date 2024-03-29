import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form, } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetail, createProductReview } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstant'





const ProductScreen = ({ match }) => {

    const { id } = useParams();
    const [qty, setQty] = useState(1)
    const [rating, setRtaing] = useState(0)
    const [comment, setComment] = useState()
    const navigate = useNavigate()


    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { success: successProductReview, error: errorProductReview } = productReviewCreate




    useEffect(() => {
        if (successProductReview) {
            alert('Review Submitted')
            setRtaing(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
        dispatch(listProductDetail(id))

    }, [dispatch, match, id, successProductReview])

    const addToCartHandler = () => {

        navigate(`/cart/${id}?qty=${qty}`)

    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(id, { rating, comment }))
    }

    return (
        <>
            <Link className='btn btn-light my-3' to='/'> Go Back</Link>
            {loading ? <Loader /> :
                error ? <Message variant={'danger'} >{error}</Message> :
                    (<>
                        <Row>
                            <Col md={6}>
                                <Image src={product.image} alt={product.name} />
                            </Col>
                            <Col md={3}>
                                <ListGroup variant='fluid'>
                                    <ListGroup.Item>
                                        <h3>{product.name}</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                    </ListGroup.Item>
                                    <ListGroup.Item>Price: <i class="fa fa-inr"></i>{product.price}</ListGroup.Item>
                                    <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={3}>
                                <Card>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>
                                                    <strong><i class="fa fa-inr"></i>{product.price}</strong></Col>
                                            </Row>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>
                                                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Qty</Col>
                                                    <Col>
                                                        <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}

                                        <ListGroup.Item>
                                            <Button className='btn-block' type='button' onClick={addToCartHandler} disabled={product.countInStock === 0}>
                                                Add to Cart
                                            </Button>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>

                        </Row>
                        <Row>
                            <Col md={6}>
                                <h2>Reviews</h2>
                                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                                <ListGroup variant='flush'>
                                    {product.reviews.map(review => (
                                        <ListGroup.Item key={review._id}>
                                            <strong>{review.name}</strong>
                                            <Rating value={review.rating} />
                                            <p>{review.createdAt}</p>
                                            <p>{review.comment} </p>
                                        </ListGroup.Item>

                                    ))}
                                    <ListGroup.Item>
                                        <h2>Write a Customer Review</h2>
                                        {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                        {userInfo ? (<Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control as='select' value={rating} onChange={(e) => setRtaing(e.target.value)} className='p-2'>
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1-Poor</option>
                                                    <option value='2'>2-Fair</option>
                                                    <option value='3'>3-Good</option>
                                                    <option value='4'>4-Very Good</option>
                                                    <option value='5'>5-Excellent</option>

                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment' className='mb-3'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control as='textarea' row='3' placeholder='Write a review' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>

                                            </Form.Group>
                                            <Button type='submit' variant='primary'>Submit</Button>

                                        </Form>) : (
                                            <Message>Please <Link to='/login' > to write a review</Link></Message>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>

                            </Col>
                        </Row>
                    </>

                    )
            }

        </>
    )
}

export default ProductScreen
