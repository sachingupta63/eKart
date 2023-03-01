import Product from "../models/productModel.js";
import asyncHandler from 'express-async-handler'

//@Route GET api/products/ public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 2

    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'

        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
})

//@Rout GET api/products/:id public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.send(product);
    } else {
        res.status(404)
        throw new Error('Product Not Found')

    }
})

//@Rout DELETE api/products/:id private/admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.remove()
        res.json({ message: "Product Removed" })
    } else {
        res.status(404)
        throw new Error('Product Not Found')
    }
})

//@Rout POST api/products/ private/admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample Product',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        category: 'Sample Category',
        brand: 'Sample Brand',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description'


    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)

})
//@Rout PUT api/products/:id private/admin
const updateProduct = asyncHandler(async (req, res) => {

    const { name, price, description, image, brand, category, countInStock } = req.body

    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const createdProduct = await product.save()
        res.status(201).json(createProduct)

    } else {
        res.status(404)
        throw new Error('Product Not Found')


    }

})

//@Rout POST api/products/:id/reviews private
const createProductReview = asyncHandler(async (req, res) => {

    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)
    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id)

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product alredy reviewd')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id

        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review Added' })

    } else {
        res.status(404)
        throw new Error('Product Not Found')


    }

})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview }