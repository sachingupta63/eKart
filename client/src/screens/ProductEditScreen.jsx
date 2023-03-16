import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetail, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstant'


const ProductEditScreen = () => {

    const { id } = useParams()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)



    const navigate = useNavigate()

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate


    useEffect(() => {

        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate('/admin/productlist')

        } else {
            if (!product.name || product._id !== id) {
                dispatch(listProductDetail(id))

            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }







    }, [product, dispatch, navigate, id, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            console.log('Hello 1')
            const { data } = await axios.post(`https://ekart-a2gt.onrender.com/api/uploads`, formData, config)
            console.log('Hello 2')
            setImage(data)
            setUploading(false)

        } catch (error) {

            console.log(error)
            setUploading(false)

        }
    }

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(updateProduct({
            _id: id,
            name,
            price,
            image, brand,
            category,
            description,
            countInStock
        }))


    }



    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back

            </Link>

            <FormContainer >
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (<Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' >
                        <Form.Label>Name</Form.Label>
                        <Form.Control

                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}>

                        </Form.Control>

                    </Form.Group>
                    <Form.Group controlId='price' className='pt-3'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control

                            type='number'
                            placeholder='Enter price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}>

                        </Form.Control>

                    </Form.Group>
                    <Form.Group controlId='image' className='pt-3'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control

                            type='text'
                            placeholder='Enter image url'
                            value={image}
                            onChange={(e) => setImage(e.target.value)}>

                        </Form.Control>

                        <Form.Control
                            type='file'
                            name='image'
                            onChange={uploadFileHandler}
                        ></Form.Control>
                        {uploading && <Loader />}



                    </Form.Group>
                    <Form.Group controlId='brand' className='pt-3'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control

                            type='text'
                            placeholder='Enter brand '
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}>

                        </Form.Control>


                    </Form.Group>
                    <Form.Group controlId='countInStock' className='pt-3'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control

                            type='number'
                            placeholder='Enter countInStock'
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}>

                        </Form.Control>


                    </Form.Group>
                    <Form.Group controlId='category' className='pt-3'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control

                            type='text'
                            placeholder='Enter ategory'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>

                        </Form.Control>


                    </Form.Group>
                    <Form.Group controlId='description' className='py-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control

                            type='text'
                            placeholder='Enter description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}>

                        </Form.Control>


                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>)}



            </FormContainer>
        </>
    )
}

export default ProductEditScreen
