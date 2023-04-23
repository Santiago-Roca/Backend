import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const productManager = new ProductManager();

//GET
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

//GET BY ID
router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    if (isNaN(id)) return res.status(404).send({ status: "error", message: "ID must be a number!" });
    const productId = await productManager.getProductsById(id);
    if (productId != null) return res.send(productId);
    res.status(404).send({ status: "error", message: "Product not found!" })
});

//POST
router.post("/", async (req, res) => {
    const product = req.body
    if (!productManager.validateData(product)) return res.status(404).send({ status: "error", message: "Faltan datos" })
    if (!await productManager.addProduct(product)) return res.status(404).send({ status: "error", message: "El producto ya existe" })
    res.send({ status: "succes", message: "Product Added" })
})

//PUT
router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    if (isNaN(id)) return res.status(404).send({ status: "error", message: "ID must be a number!" });
    const productUpdate = req.body
    if (!productManager.validateData(productUpdate)) return res.status(404).send({ status: "error", message: "Faltan datos" })
    if (!await productManager.updateProduct(id, productUpdate)) return res.status(404).send({ status: "error", message: "Ya existe un producto con ese código" })
    if (await productManager.updateProduct(id, productUpdate) == 'notFound') return res.status(404).send({ status: "error", message: "No existen productos con ese ID" })
    res.send({ status: "succes", message: "Product Updated" })
})

//DELETE
router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    if (isNaN(id)) return res.status(404).send({ status: "error", message: "ID must be a number!" });
    if (!await productManager.deleteProduct(id)) return res.status(404).send({ status: "error", message: "Product not found!" })
    res.send({ status: "succes", message: "Product Deleted" })
})


export default router;
