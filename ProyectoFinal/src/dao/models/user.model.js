import mongoose from "mongoose";

const collection = "Users"

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    age: Number,
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts",
    },
    lastConecction: Date,
}, { timestamps: true })

schema.pre('find', function () {
    this.populate('cart')
})

schema.pre('findOne', function () {
    this.populate('cart')
})

const userModel = mongoose.model(collection, schema);

export default userModel;

