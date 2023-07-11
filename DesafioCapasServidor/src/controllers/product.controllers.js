import productModel from "../dao/mongo/models/product.js";
import {productService}  from "../services/index.js";

//GET PRODUCTS
const getProducts = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const { limit = 10 } = req.query;
        const { sort } = req.query;

        let ordenar = "";

        if (sort == 1 || sort == -1 || sort == "asc" || sort == "desc") {
            ordenar = { price: sort };
        }

        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            ...rest } = await productModel.paginate({}, { page, limit, sort: ordenar, lean: true, });

        let urlPrevPage = null;
        let urlNextPage = null;

        if (hasPrevPage) {
            urlPrevPage = new URL(
                `http://localhost:8080/api/products/?page=${prevPage}`
            );
        }
        if (hasNextPage) {
            urlNextPage = new URL(
                `http://localhost:8080/api/products/?page=${nextPage}`
            );
        }

        const products = docs;
        res.send({
            status: "success",
            payload: products,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: rest.page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: urlPrevPage,
            nextLink: urlNextPage,
        });
        req.io.emit("products", products);
    } catch (error) {
        res
            .status(500)
            .send({ status: "error", message: "Error al obtener productos" });
    }
};

//GET PRODUCTS BY CATEGORY
const getProductsByCategory = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const { limit = 10 } = req.query;
        const { sort } = req.query;
        const { category } = req.params;

        let ordenar = "";

        if (sort == 1 || sort == -1 || sort == "asc" || sort == "desc") {
            ordenar = { price: sort };
        }

        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            ...rest
        } = await productModel.paginate(
            { category },
            {
                page,
                limit,
                sort: ordenar,
                lean: true,
            }
        );

        let urlPrevPage = null;
        let urlNextPage = null;

        if (hasPrevPage) {
            urlPrevPage = new URL(
                `http://localhost:8080/api/products/?page=${prevPage}`
            );
        }
        if (hasNextPage) {
            urlNextPage = new URL(
                `http://localhost:8080/api/products/?page=${nextPage}`
            );
        }

        const products = docs;
        res.send({
            status: "success",
            payload: products,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: rest.page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: urlPrevPage,
            nextLink: urlNextPage,
        });
        req.io.emit("products", products);
    } catch (error) {
        res
            .status(500)
            .send({ status: "error", message: "Error al obtener productos" });
    }
};

//GET PRODUCTS BY ID
const getProductsById = async (req, res) => {
    try {
        const pid = req.params.pid;
        const productId = await productService.getProductBy({ _id: pid });
        console.log(productId);
        if (!productId)
            return res
                .status(404)
                .send({ status: "error", error: "Product not found" });
        res.send({ status: "success", payload: productId });
    } catch (error) {
        console.log(error);
    }
};

//CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const { title, description, code, price, category } = req.body;
        if (!title || !description || !code || !price || !category)
            return res
                .status(400)
                .send({ status: "error", error: "Incomplete Values" });
        const product = { title, description, code, price, category };
        await productService.createProduct(product);
        res.sendStatus(201);
        const products = await productService.getAllProducts();
        req.io.emit("products", products);
    } catch (error) {
        console.log(error);
    }
};

//UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const updateProduct = req.body;
        const result = await productService.updateProduct(pid, updateProduct);
        res.sendStatus(201);
        const products = await productService.getAllProducts();
        req.io.emit("products", products);
    } catch (error) {
        console.log(error);
    }
};

//DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        await productService.deleteProduct(pid);
        res.sendStatus(201);
        const products = await productService.getAllProducts();
        req.io.emit("products", products);
    } catch (error) {
        console.log(error);
    }
};

export default {
    getProducts,
    getProductsByCategory,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct,
};
