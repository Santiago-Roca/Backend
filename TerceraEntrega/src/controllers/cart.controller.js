import cartModel from "../dao/models/cart.model.js";
import { cartService, productService, ticketService } from "../services/repositories.js"


//GET CARTS    
const getCarts = async (req, res) => {
    const carts = await cartService.getAllCarts()
    res.send({ status: "success", payload: carts });
}

//GET CART BY ID
const getCartById = async (req, res) => {
    const { cid } = req.params
    const cartId = await cartService.getCartById({ _id: cid })
    if (!cartId) return res.status(404).send({ status: "error", error: "Cart not found" });
    res.send({ status: "success", payload: cartId })
}

//POST CART
const createCart = async (req, res) => {
    const { products } = req.body;
    if (!products) return res.status(400).send({ status: "error", error: "Incomplete Values" })
    const cart = { products }
    const result = await cartService.createCart(cart)
    res.send({ status: "Success", payload: result })

}

//POST PRODUCT ON CART
const addProductCart = async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        const cartExists = await cartService.getCartById({ _id: cid })
        const productExistsInCart = await cartService.getCartById({ _id: cid, "products.product": { _id: pid } })
        if (cartExists) {
            if (productExistsInCart) {
                cartExists.products.map(async (item) => {
                    if (item.product._id == pid) {
                        let cantidad = item.quantity + 1
                        await cartModel.updateOne({ _id: cid, "products.product": { _id: pid } }, { $set: { "products.$.quantity": cantidad } })
                    }
                })
                return res.send({ status: "success", message: "Product Added on cart" })
            } else {
                const productExists = await productService.getProductBy({ _id: pid })
                if (productExists) {
                    await cartService.addProductCart(cid, pid);
                    return res.send({ status: "success", message: "Product Added on cart" })
                }
                return res.status(400).send({ status: "error", message: "Product not found" })
            }
        }
        return res.status(400).send({ status: "error", message: "Cart not found" })

    } catch (error) {
        console.log(error)
    }
}

//PUT (Actualizar Quantity)
const updateQuantity = async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    const { quantity } = req.body
    try {
        if (!quantity) {
            return res.status(400).send({ status: "error", message: "Quantity not found" })
        }
        if (isNaN((parseInt(quantity)))) {
            return res.status(400).send({ status: "error", message: "Quantity must be a number" })
        }
        const cartExists = await cartService.getCartById({ _id: cid })
        const productExistsInCart = await cartService.getCartById({ _id: cid, "products.product": { _id: pid } })
        if (cartExists) {
            if (productExistsInCart) {
                cartExists.products.map(async (item) => {
                    if (item.product._id == pid) {
                        let cantidad = quantity
                        await cartModel.updateOne({ _id: cid, "products.product": { _id: pid } }, { $set: { "products.$.quantity": cantidad } })
                    }
                })
                return res.send({ status: "success", message: "Quantity updated in cart" })
            }
            return res.status(400).send({ status: "error", message: "Product not found" })

        }
        return res.status(400).send({ status: "error", message: "Cart not found" })

    } catch (error) {
        console.log(error)
    }
}

//DELETE (Product on cart)
const deleteProductCart = async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        const cartExists = await cartService.getCartById({ _id: cid })
        const productExistsInCart = await cartService.getCartById({ _id: cid, "products.product": { _id: pid } })
        if (cartExists) {
            if (productExistsInCart) {
                cartExists.products.map(async (item) => {
                    if (item.product._id == pid) {
                        await cartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } })
                    }
                })
                return res.send({ status: "success", message: "Product Deleted" })
            }
            return res.status(400).send({ status: "error", message: "Product not found" })
        }
        return res.status(400).send({ status: "error", message: "Cart not found" })

    } catch (error) {
        console.log(error)
    }
}

//DELETE (All Products in cart)
const deleteAllProducts = async (req, res) => {
    const { cid } = req.params
    try {
        const cartExists = await cartService.getCartById({ _id: cid })
        if (cartExists) {
            await cartModel.updateOne({ _id: cid }, { $pull: { products: {} } })
            return res.send({ status: "success", message: "Products Deleted" })
        }
        return res.status(400).send({ status: "error", message: "Cart not found" })

    } catch (error) {
        console.log(error)
    }
}

//FINALIZAR COMPRA
const finalizePurchase = async (req, res) => {
    const { cid } = req.params;
    const email = req.user.email;
    let precioTotal = 0;
    let cart = await cartService.getCartById({ _id: cid });

    //Si no hay productos en ese carrito mostrar mensaje
    if (cart.products.length === 0) {
        return res.send({ status: "error", error: "There are no products in the selected cart" });
    }

    //Recorro los productos en el carrito y hago validaciones
    cart.products.forEach(async (item) => {
        const product = await productService.getProductBy({ _id: item.product._id })
        if (product.stock >= item.quantity) {
            precioTotal = precioTotal + item.product.price;
            const newStock = product.stock - item.quantity
            await productService.updateProduct(item.product._id, { stock: newStock })
            await cartService.deleteProductCart(cid, item.product._id)
            await cartService.getCartById({ _id: cid })
        }
    });

    if (cart.products.length === 0) {
        const ticket = {
            code: Date.now() * Math.floor(Math.random() * 1000),
            amount: precioTotal,
            purchaser: email
        }
        const response = await ticketService.createTicket(ticket)
        return res.send({ status: "success", payload: response });
    }

    return res.send({ status: "Incomplete", message: ", there are products in the cart that could not be completed", payload: cart })

}

export default {
    getCarts, getCartById, createCart, addProductCart, updateQuantity, deleteAllProducts, deleteProductCart, finalizePurchase
}