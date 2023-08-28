import mongoose from "mongoose";
import cartModel from "./models/cart.model.js";

export default class CartsManager {

  get = (params) => {
    return cartModel.find(params).lean();
  };

  getBy = (id) => {
    return cartModel.findOne(id).lean();
  };

  save = (cart) => {
    return cartModel.create(cart);
  };

  addProductCart = (cartId, productId) => {
    return cartModel.updateOne({ _id: cartId }, { $push: { products: { product: new mongoose.Types.ObjectId(productId) } } })
  }

  deleteProductCart = (cartId, productId) => {
    return cartModel.updateOne({ _id: cartId }, { $pull: { products: { product: productId } } })
  }

  update = (id, cart) => {
    return cartModel.findByIdAndUpdate(id, { $set: cart });
  };

  updateQuantity = (id, quantity) => {
    return cartModel.findByIdAndUpdate(id, { $set: { quantity: quantity } });
  };

  delete = (id) => {
    return cartModel.findByIdAndDelete(id);
  };

}
