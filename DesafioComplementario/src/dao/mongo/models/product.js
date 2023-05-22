import mongoose from "mongoose";

const collection = "Products";

const schema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    default: 10,
  },
  category: String,
  thumbnail: [],
},
{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const productModel = mongoose.model(collection, schema);
export default productModel;
