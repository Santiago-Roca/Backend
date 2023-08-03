import EErrors from "../constant/EErrors.js";
import { productErrorIncompleteValues, productErrorRepitedCode } from "../constant/productErrors.js";
import productModel from "../dao/models/product.model.js";
import { generateProduct } from "../mocks/product.mock.js";
import ErrorService from "../services/ErrorService.js";
import { productService } from "../services/repositories.js";

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
        req.logger.info(productId);
        if (!productId)
            return res
                .status(404)
                .send({ status: "error", error: "Product not found" });
        res.send({ status: "success", payload: productId });
    } catch (error) {
        req.logger.error(error);
    }
};

//POST PRODUCT
const createProduct = async (req, res) => {
    const { title, description, code, price, category } = req.body;
    const exists = await productService.getProductBy({ code: code })

    if (!title || !description || !code || !price || !category) {
        ErrorService.createError({
            name: "Error de creación de producto",
            cause: productErrorIncompleteValues(),
            message: 'Error intentando crear un nuevo producto',
            code: EErrors.INCOMPLETE_VALUES,
            status: 400
        })
    }
    if (exists) {
        ErrorService.createError({
            name: "Error de creación de producto",
            cause: productErrorRepitedCode(exists),
            message: 'Error intentando crear un nuevo producto',
            code: EErrors.REPITED_CODE,
            status: 400
        })
    }
    try {
        const product = { title, description, code, price, category };
        const result = await productService.createProduct(product);
        res.send({ status: "Success", payload: result });
        const products = await productService.getAllProducts();
        req.io.emit("products", products);

    } catch (error) {
        req.logger.error(error);
        res.sendStatus(500);
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
        req.logger.error(error);
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
        req.logger.error(error);
    }
};

//GET MOCKS
const getMocks = async (req, res) => {
    try {
        const products = [];
        for (let i = 0; i <= 100; i++) {
            products.push(generateProduct());
        }
        res.send({ status: "success", payload: products })
    } catch (error) {
        req.logger.error(error);
    }
}

export default {
    getProducts,
    getProductsByCategory,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct,
    getMocks
};
