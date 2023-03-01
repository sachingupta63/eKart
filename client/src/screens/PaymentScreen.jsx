import React, { useState } from 'react'
import { Button, Form, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartAction'
import CheckOutSteps from '../components/CheckOutSteps'

const PaymentScreen = () => {
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    if (!shippingAddress) {
        navigate('/shipping')
    }

    const [payment, setPaymentMethod] = useState('PayPal')


    const dispatch = useDispatch()


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(payment))
        navigate('/placeorder')

    }

    return (
        <FormContainer>
            <CheckOutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3'>
                    <Form.Label as='legend'  >Select Method</Form.Label>

                    <Col>
                        <Form.Check type='radio' label='PayPal or Credit Card' id='PayPal' name='paymentMethod' value='PayPal' checked onChange={(e) => setPaymentMethod(e.target.value)}>

                        </Form.Check>
                        {/* <Form.Check type='radio' label='Stripe' id='Stripe' name='paymentMethod' value='Stripe' checked onChange={(e) => setPaymentMethod(e.target.value)}>

                        </Form.Check> */}
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>

            </Form>

        </FormContainer>
    )
}

export default PaymentScreen
