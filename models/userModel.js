const mongoose = require("mongoose")
const validator = require("validator")
const bcryptjs = require("bcryptjs")


const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        minlength: 3,
        required: [true, "please enter a firstName"]
    },
    lastName: {
        type: String,
        minlength: 3,
        required: [true, "please enter a lastName"]
    },
    username: { type: String, lowercase: true, required: [true, "Please provide your username"], trim: true, unique: true },

    email: {
        type: String,
        trim: true,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "not a valid email"]

    },

    photo: {
        type: String,
        default: "./efrgv"
    },
    password: {
        type: String,
        reuired: true,
        minlength: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        reuired: true,
        minlength: 8,
        validate: {
            validator: function () {
                return this.passwordConfirm == this.password
            },

            message: "password dose not match"
        },

    },
    passwordChangedAt: Date,
    isAdmin: {
        type: Boolean,
        default: false
    }

})

// middle wares

userSchema.pre("save", async function (next) {


    if (!this.isModified("password")) return next()

    this.password = await bcryptjs.hash(this.password, 13)

    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.comparePassword = async function (inputedPassword, userPassword) {
    return await bcryptjs.compare(inputedPassword, userPassword)
}


userSchema.methods.isPasswordChanged = async function (JWTTimeStamp) {

    if (this.passwordChangedAt) {

        const passwordChangedTimeStamp = parseInt(this.passwordChangedAt.getTime(), 10)


        return JWTTimeStamp < passwordChangedTimeStamp
    }

    return false
}

const User = mongoose.model("User", userSchema)

module.exports = User