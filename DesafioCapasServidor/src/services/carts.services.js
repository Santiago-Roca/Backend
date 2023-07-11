export default class CartService {
    constructor(dao) {
        this.dao = dao;
    }

    getAllCarts = (params) => {
        return this.dao.getCarts(params)
    };

    getCartById = (id) => {
        return this.dao.getCartById(id)
    };

    createCart = (cart) => {
        return this.dao.createCart(cart);
    };

    addProductCart = (cartId, productId) => {
        return this.dao.addProductCart(cartId, productId)
    }

    updateCart = (id, cart) => {
        return this.dao.updateCart(id, cart)
    }

    updateQuantity = (id, quantity) => {
        return this.dao.updateQuantity(id, quantity)
    }

    deleteCart = (id) => {
        return this.dao.deleteCart(id)
    }

}