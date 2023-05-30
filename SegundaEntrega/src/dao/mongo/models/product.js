import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Products";

const schema = new mongoose.Schema(
  {
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

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema);
export default productModel;
