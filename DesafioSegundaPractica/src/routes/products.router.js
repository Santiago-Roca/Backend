import { passportCall } from "../services/auth.js";
import BaseRouter from "./Router.js";
import productModel from "../dao/mongo/models/product.js";


export default class ProductRouter extends BaseRouter {
    init() {
        // this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'locals' }), (req, res) => {
        //     res.sendSuccess("Register success")
        // })
        // this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'locals' }), (req, res) => {
        //     const token = generateToken(req.user)
        //     res.cookie('authToken', token, { maxAge: 1000 * 3600 * 24, httpOnly: true }).sendSuccess("Logged in")
        // })

        // this.get('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), (req, res) => {
        //     if (!req.user) return res.sendUnauthorized("User not logged in")
        //     res.send(req.user)
        // })


        //GET
        this.get('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
            try {
                const { page = 1 } = req.query;
                const { limit = 10 } = req.query;
                const { sort } = req.query;

                let ordenar = ''

                if (sort == 1 || sort == -1 || sort == 'asc' || sort == 'desc') {
                    ordenar = { price: sort }
                }

                const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({}, {
                    page, limit, sort: ordenar, lean: true
                });

                let urlPrevPage = null;
                let urlNextPage = null;

                if (hasPrevPage) {
                    urlPrevPage = new URL(`http://localhost:8080/api/products/?page=${prevPage}`);
                }
                if (hasNextPage) {
                    urlNextPage = new URL(`http://localhost:8080/api/products/?page=${nextPage}`);
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
                res.status(500).send({ status: "error", message: "Error al obtener productos" });
            }
        });

    }
}




// import { Router } from "express";
// import ProductsManager from "../dao/mongo/managers/ProductManager.js";
// import productModel from "../dao/mongo/models/product.js";

// const router = Router();
// const productManager = new ProductsManager();

// //GET
// router.get("/", async (req, res) => {
//     try {
//         const { page = 1 } = req.query;
//         const { limit = 10 } = req.query;
//         const { sort } = req.query;

//         let ordenar = ''

//         if (sort == 1 || sort == -1 || sort == 'asc' || sort == 'desc') {
//             ordenar = { price: sort }
//         }

//         const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({}, {
//             page, limit, sort: ordenar, lean: true
//         });

//         let urlPrevPage = null;
//         let urlNextPage = null;

//         if (hasPrevPage) {
//             urlPrevPage = new URL(`http://localhost:8080/api/products/?page=${prevPage}`);
//         }
//         if (hasNextPage) {
//             urlNextPage = new URL(`http://localhost:8080/api/products/?page=${nextPage}`);
//         }

//         const products = docs;
//         res.send({
//             status: "success",
//             payload: products,
//             totalPages: totalPages,
//             prevPage: prevPage,
//             nextPage: nextPage,
//             page: rest.page,
//             hasPrevPage: hasPrevPage,
//             hasNextPage: hasNextPage,
//             prevLink: urlPrevPage,
//             nextLink: urlNextPage,
//         });
//         req.io.emit("products", products);

//     } catch (error) {
//         res.status(500).send({ status: "error", message: "Error al obtener productos" });
//     }
// });

// //CATEGORY FILTER
// router.get("/:category", async (req, res) => {
//     try {
//         const { page = 1 } = req.query;
//         const { limit = 10 } = req.query;
//         const { sort } = req.query;
//         const { category } = req.params;

//         let ordenar = ''

//         if (sort == 1 || sort == -1 || sort == 'asc' || sort == 'desc') {
//             ordenar = { price: sort }
//         }

//         const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({ category }, {
//             page, limit, sort: ordenar, lean: true
//         });

//         let urlPrevPage = null;
//         let urlNextPage = null;

//         if (hasPrevPage) {
//             urlPrevPage = new URL(`http://localhost:8080/api/products/?page=${prevPage}`);
//         }
//         if (hasNextPage) {
//             urlNextPage = new URL(`http://localhost:8080/api/products/?page=${nextPage}`);
//         }

//         const products = docs;
//         res.send({
//             status: "success",
//             payload: products,
//             totalPages: totalPages,
//             prevPage: prevPage,
//             nextPage: nextPage,
//             page: rest.page,
//             hasPrevPage: hasPrevPage,
//             hasNextPage: hasNextPage,
//             prevLink: urlPrevPage,
//             nextLink: urlNextPage,
//         });
//         req.io.emit("products", products);

//     } catch (error) {
//         res.status(500).send({ status: "error", message: "Error al obtener productos" });
//     }
// });

// //GET BY ID
// router.get("/:pid", async (req, res) => {
//     try {
//         const pid = req.params.pid;
//         const productId = await productManager.getProductBy({ _id: pid });
//         console.log(productId);
//         if (!productId) return res.status(404).send({ status: "error", error: "Product not found" });
//         res.send({ status: "success", payload: productId });
//     } catch (error) {
//         console.log(error);
//     }
// });

// //POST
// router.post("/", async (req, res) => {
//     try {
//         const { title, description, code, price, category } = req.body;
//         if (!title || !description || !code || !price || !category)
//             return res.status(400).send({ status: "error", error: "Incomplete Values" });
//         const product = { title, description, code, price, category };
//         await productManager.createProduct(product);
//         res.sendStatus(201);
//         const products = await productManager.getProducts();
//         req.io.emit("products", products);
//     } catch (error) {
//         console.log(error);
//     }
// });

// //PUT
// router.put("/:pid", async (req, res) => {
//     try {
//         const { pid } = req.params;
//         const updateProduct = req.body;
//         const result = await productManager.updateProduct(pid, updateProduct);
//         res.sendStatus(201);
//         const products = await productManager.getProducts();
//         req.io.emit("products", products);
//     } catch (error) {
//         console.log(error);
//     }
// });

// //DELETE
// router.delete("/:pid", async (req, res) => {
//     try {
//         const { pid } = req.params;
//         await productManager.deleteProduct(pid);
//         res.sendStatus(201);
//         const products = await productManager.getProducts();
//         req.io.emit("products", products);
//     } catch (error) {
//         console.log(error);
//     }
// });

// export default router;
