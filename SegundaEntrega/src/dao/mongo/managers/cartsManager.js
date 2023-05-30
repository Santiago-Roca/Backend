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
    const cart = this.getCartById(cartId)
    cart.products.push({ product: productId })
    // cartModel.updateOne({_id: cartId})
    this.updateCart(cartId, cart)
    return cart;

  }

  updateCart = (id, cart) => {
    return cartModel.findByIdAndUpdate(id, { $set: cart });
  };

  deleteCart = (id) => {
    return cartModel.findByIdAndDelete(id);
  };

}
