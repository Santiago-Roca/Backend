import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const router = Router();

const cartManager = new CartManager()

//GET CARTS
router.get("/", async (req, res) => {
    res.send(await cartManager.getCarts())
});

//POST CART
router.post("/", async (req, res) => {
    const cart = req.body
    await cartManager.addCart(cart)
    res.send({ status: "succes", message: "Cart Added" })
})

//POST (Products on cart)
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    if (isNaN(cartId)) return res.status(404).send({ status: "error", message: "Cart ID must be a number!" });
    const productId = req.params.pid
    if (isNaN(productId)) return res.status(404).send({ status: "error", message: "Product ID must be a number!" });
    if (!await cartManager.addProductCart(cartId, productId)) return res.status(404).send({ status: "error", message: "Cart not found!" });
    res.send({ status: "succes", message: "Product Added on cart" })

});

//GET BY ID
router.get("/:cid", async (req, res) => {
    const id = parseInt(req.params.cid);
    if (isNaN(id)) return res.status(404).send({ status: "error", message: "ID must be a number!" });
    const cartId = await cartManager.getProductsCartById(id)
    if (cartId != null) return res.send(cartId.products);
    res.status(404).send({ status: "error", message: "Cart not found!" })
});

export default router