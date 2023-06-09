import { Router, json } from "express";
import CartsManager from "../dao/mongo/managers/cartsManager.js";
import ProductManager from "../dao/mongo/managers/ProductManager.js";
import cartModel from "../dao/mongo/models/cart.js";

const router = Router();

const cartManager = new CartsManager();
const productManager = new ProductManager()

//GET CARTS
router.get("/", async (req, res) => {
    const carts = await cartManager.getCarts();
    res.send({ status: "success", payload: carts });
});

//GET CART BY ID
router.get("/:cid", async (req, res) => {
    const { cid } = req.params
    const cartId = await cartManager.getCartById({ _id: cid })
    if (!cartId) return res.status(404).send({ status: "error", error: "Cart not found" });
    res.send({ status: "success", payload: cartId })
});

//POST CART
router.post("/", async (req, res) => {
    const { products } = req.body;
    if (!products) return res.status(400).send({ status: "error", error: "Incomplete Values" })
    const cart = { products }
    await cartManager.createCart(cart)
    res.sendStatus(201);
});

//POST (Products on cart)
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        const cartExists = await cartManager.getCartById({ _id: cid })
        const productExistsInCart = await cartManager.getCartById({ _id: cid, "products.product": { _id: pid } })
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
                const productExists = await productManager.getProductBy({ _id: pid })
                if (productExists) {
                    await cartManager.addProductCart(cid, pid);
                    return res.send({ status: "success", message: "Product Added on cart" })
                }
                return res.status(400).send({ status: "error", message: "Product not found" })
            }
        }
        return res.status(400).send({ status: "error", message: "Cart not found" })

    } catch (error) {
        console.log(error)
    }
});

//PUT (Actualizar Quantity)
router.put("/:cid/product/:pid", async (req, res) => {
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
        const cartExists = await cartManager.getCartById({ _id: cid })
        const productExistsInCart = await cartManager.getCartById({ _id: cid, "products.product": { _id: pid } })
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
});

//DELETE (Product on cart)
router.delete("/:cid/product/:pid", async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        const cartExists = await cartManager.getCartById({ _id: cid })
        const productExistsInCart = await cartManager.getCartById({ _id: cid, "products.product": { _id: pid } })
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
});

//DELETE (All Products in cart)
router.delete("/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const cartExists = await cartManager.getCartById({ _id: cid })
        if (cartExists) {
            await cartModel.updateOne({ _id: cid }, { $pull: { products: {} } })
            return res.send({ status: "success", message: "Products Deleted" })
        }
        return res.status(400).send({ status: "error", message: "Cart not found" })

    } catch (error) {
        console.log(error)
    }
});

export default router;
