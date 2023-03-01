import mongoose from "mongoose"
import bcrypt from 'bcryptjs'


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmine: {
        type: Boolean,
        required: true,
        default: false
    }


}, {
    timestamps: true
})

//Middleware function called when we are accessiing private route
userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password)

}
//This middleware called before saving to database and hash the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('eKartUser', userSchema)

export default User