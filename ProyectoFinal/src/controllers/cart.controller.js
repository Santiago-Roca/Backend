import DTemplates from "../constant/DTemplates.js";
import cartModel from "../dao/models/cart.model.js";
import MailingService from "../services/MailingService.js";
import { cartService, productService, ticketService, userService } from "../services/repositories.js"

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

//CREATE CART
const createCart = async (req, res) => {
    const { products } = req.body;
    if (!products) return res.status(400).send({ status: "error", error: "Incomplete Values" })
    const cart = { products }
    const result = await cartService.createCart(cart)
    res.send({ status: "success", payload: result })
}

//POST PRODUCT ON CART
const addProductCart = async (req, res) => {
    let user = req.user
    let cid = user.cart
    const { pid } = req.params
    try {
        let user = await userService.getUserBy({ cart: cid })
        let product = await productService.getProductBy({ _id: pid })
        const cartExists = await cartService.getCartById({ _id: cid })
        const productExistsInCart = await cartService.getCartById({ _id: cid, "products.product": { _id: pid } })
        if (cartExists) {
            if (user.role === "premium" && user.email === product.owner) {
                return res.send({ status: "error", error: `El usuario ${user.email} no puede agregar a su carrito un producto creado por el mismo` })
            }
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
        req.logger.error(error);

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
        req.logger.error(error);
    }
}

//DELETE (Product on cart)
const deleteProductCart = async (req, res) => {
    try {
        const cid = req.user.cart._id
        const { pid } = req.params
        const productExistsInCart = await cartService.getCartById({ _id: cid, "products.product": { _id: pid } })
        if (!productExistsInCart) return res.status(400).send({ status: "error", message: "Product not found" })
        await cartService.deleteProductCart(cid, pid)
        res.send({ status: "success" })

    } catch (error) {
        req.logger.error(error);
    }
}

//DELETE (All Products in cart)
const deleteAllProducts = async (req, res) => {
    const cid = req.user.cart._id
    try {
        await cartService.deleteAllProducts(cid)
        res.send({ status: "success", message: "Todos los productos han sido eliminados" })
    } catch (error) {
        req.logger.error(error);
    }
}

//FINALIZAR COMPRA
const finalizePurchase = async (req, res) => {
    const user = req.user
    const cartID = req.user.cart._id
    const email = req.user.email;
    let cart = await cartService.getCartById({ _id: cartID });
    let precioTotal = 0;

    //Si no hay productos en ese carrito mostrar mensaje
    if (cart.products.length === 0) {
        return res.send({ status: "error", error: "No hay productos en el carrito" });
    }

    //Recorro los productos en el carrito y hago validaciones
    let counter = 0;
    let productsNotAdded = []
    cart.products.forEach(async (item) => {
        const product = await productService.getProductBy({ _id: item.product._id })

        if (product.stock >= item.quantity) {
            precioTotal = precioTotal + (item.product.price * item.quantity);

            //Actualizamos nuevo stock
            const newStock = product.stock - item.quantity
            await productService.updateProduct(item.product._id, { stock: newStock })

            //Borramos item del carrito
            await cartService.deleteProductCart(cart._id, item.product._id)
            counter++
        } else {
            counter++
            productsNotAdded.push(item)
        }

        if (counter == cart.products.length) {
            if (productsNotAdded.length > 0) {
                return res.send({ status: "Incomplete", message: ", there are products in the cart that could not be completed", payload: productsNotAdded })
            } else {
                const ticket = {
                    code: Date.now() * Math.floor(Math.random() * 1000),
                    amount: precioTotal,
                    purchaser: email
                }
                const response = await ticketService.createTicket(ticket)

                //Envió mail con datos de compra
                const mailingService = new MailingService();
                const result = await mailingService.sendMail(email, DTemplates.PURCHASE, { ticket, user })
                res.send({ status: "success", payload: ticket });
            }
        }
    });
}

export default {
    getCarts, getCartById, createCart, addProductCart, updateQuantity, deleteAllProducts, deleteProductCart, finalizePurchase
}