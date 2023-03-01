import path from 'path'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import cors from 'cors'
import productRoute from './routes/productRoutes.js'
import userRoute from './routes/userRoutes.js'
import orderRoute from './routes/orderRoute.js'
import uploadRoute from './routes/uploadRoutes.js'



const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))

}


dotenv.config()
app.use(cors())
app.use(express.json())

connectDB()


app.get('/', (req, res) => {
    res.send('Api Running')
})

app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/orders', orderRoute)
app.use('/api/uploads', uploadRoute)
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))) //making upload folder available
app.use(notFound)
app.use(errorHandler)



app.listen(process.env.PORT, (err) => {
    if (err)
        console.log(err);
    console.log(`Server Runnig in ${process.env.NODE_ENV} mode successfully on ${process.env.PORT}`)

})