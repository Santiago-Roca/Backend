import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const productManager = new ProductManager();

//GET PRODUCTS
router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    const search = Object.keys(req.query)[0];
    if (search == "limit") {
        if (isNaN(req.query[search])) return res.status(404).send({ status: "error", message: "Limit is not a number!" });
        const productsLimit = products.slice(0, req.query[search]);
        return res.send(productsLimit);
    }
    res.send(products);
});

//GET PRODUCTS BY ID
router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    if (isNaN(id)) return res.status(404).send({ status: "error", message: "ID is not a number!" });
    const productId = await productManager.getProductsById(id);
    if (productId != null) return res.send(productId);
    res.status(404).send("Product not found!");
});

//ADDING A PRODUCT

router.post("/", (req, res)=>{
    const product = req.body
    productManager.addProduct(product)
})

export default router;
