import { Router } from "express";
import CartsManager from "../dao/mongo/managers/cartsManager.js";
import ProductManager from "../dao/mongo/managers/ProductManager.js";

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
    const cartExists = await cartManager.getCartById({ _id: cid })
    if (!cartExists) return res.status(404).send({ status: "error", error: "Cart not found" });
    const productExists = await productManager.getProductBy({ _id: pid })
    if (!productExists) return res.status(404).send({ status: "error", error: "Product not found" });

    cartExists.products.push({ product: pid })

    // cartManager.updateCart({_id: cid}, cartExists)
    // productManager.addProductCart(cid, pid)
    // res.send({ status: "success", payload: cartExists })
    if (!await cartManager.addProductCart(cartId, productId)) return res.status(404).send({ status: "error", message: "Cart not found!" });

    res.send({ status: "succes", message: "Product Added on cart" })

});

export default router;
