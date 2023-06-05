import mongoose from "mongoose";
import cartModel from "../models/cart.js";

export default class CartsManager {

  getCarts = (params) => {
    return cartModel.find(params).lean();
  };

  getCartById = (id) => {
    return cartModel.findOne(id).lean();
  };

  createCart = (cart) => {
    return cartModel.create(cart);
  };

  addProductCart = (cartId, productId) => {
    return cartModel.updateOne({ _id: cartId }, { $push: { products: { product: new mongoose.Types.ObjectId(productId) } } })
  }

  updateCart = (id, cart) => {
    return cartModel.findByIdAndUpdate(id, { $set: cart });
  };

  updateQuantity = (id, quantity) => {
    return cartModel.findByIdAndUpdate(id, { $set: { quantity: quantity } });
  };

  deleteCart = (id) => {
    return cartModel.findByIdAndDelete(id);
  };

}
