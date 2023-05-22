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

  updateCart = (id, cart) => {
    return cartModel.findByIdAndUpdate(id, { $set: cart });
  };

  deleteCart = (id) => {
    return cartModel.findByIdAndDelete(id);
  };

}
