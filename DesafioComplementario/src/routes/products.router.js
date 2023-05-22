import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/ProductManager.js";

const router = Router();
const productManager = new ProductsManager();

//GET
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const search = Object.keys(req.query)[0];
        if (search == "limit") {
            if (isNaN(req.query[search])) return res.status(404).send({ status: "error", message: "Limit is not a number!" });
            const productsLimit = products.slice(0, req.query[search]);
            return res.send(productsLimit);
        }
        req.io.emit('products', products);
        res.send(products);
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al obtener productos" })
    }
});

//GET BY ID
router.get("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const productId = await productManager.getProductBy({ _id: pid });
        console.log(productId)
        if (!productId) return res.status(404).send({ status: 'error', error: 'Product not found' });
        res.send({ status: 'success', payload: productId });
    } catch (error) {
        console.log(error)
    }
});

//POST
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, category } = req.body
        if (!title || !description || !code || !price || !category) return res.status(400).send({ status: "error", error: "Incomplete Values" })
        const product = { title, description, code, price, category }
        await productManager.createProduct(product)
        res.sendStatus(201);
        const products = await productManager.getProducts()
        req.io.emit('products', products);
    } catch (error) {
        console.log(error)
    }
})

//PUT
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateProduct = req.body;
        const result = await productManager.updateProduct(pid, updateProduct);
        res.sendStatus(201);
        const products = await productManager.getProducts()
        req.io.emit('products', products);
    } catch (error) {
        console.log(error)
    }
})

//DELETE
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await productManager.deleteProduct(pid);
        res.sendStatus(201);
        const products = await productManager.getProducts()
        req.io.emit('products', products);
    } catch (error) {
        console.log(error)
    }
})

export default router;