export default class CartService {
    constructor(dao) {
        this.dao = dao;
    }

    getAllCarts = (params) => {
        return this.dao.get(params)
    };

    getCartById = (id) => {
        return this.dao.getBy(id)
    };

    createCart = (cart) => {
        return this.dao.save(cart);
    };

    addProductCart = (cartId, productId) => {
        return this.dao.addProductCart(cartId, productId)
    }

    deleteProductCart = (cartId, productId) => {
        return this.dao.deleteProductCart(cartId, productId)
    }

    deleteAllProducts = (cartId) => {
        return this.dao.deleteAllProducts(cartId)
    }

    updateCart = (id, cart) => {
        return this.dao.update(id, cart)
    }

    updateQuantity = (id, quantity) => {
        return this.dao.updateQuantity(id, quantity)
    }

    deleteCart = (id) => {
        return this.dao.delete(id)
    }

}