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
}, { timestamps: true })

const userModel = mongoose.model(collection, schema);

export default userModel;

