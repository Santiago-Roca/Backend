import { Router } from "express";
import CartsManager from "../dao/mongo/managers/cartsManager.js";

const router = Router();

const cartManager = new CartsManager();

//GET CARTS
router.get("/", async (req, res) => {
    const carts = await cartManager.getCarts();
    res.send({ status: "success", payload: carts });
});

//GET CART BY ID
router.get("/:cid", async (req, res) => {
    const id = parseInt(req.params.cid);
    if (isNaN(id)) return res.status(404).send({ status: "error", message: "ID must be a number!" });

    const cartId = await cartManager.getCartById(id)

    if (cartId != null) return res.send(cartId.products);
    res.status(404).send({ status: "error", message: "Cart not found!" });
});

//POST CART
router.post("/", async (req, res) => {
    const { products } = req.body;
    if (!products) return res.status(400).send({ status: "error", error: "Incomplete Values" })
    const cart = { products }
    await cartManager.createCart(cart)
    res.sendStatus(201);
});

export default router;
