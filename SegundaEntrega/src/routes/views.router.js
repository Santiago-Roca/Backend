import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/ProductManager.js";
import productModel from "../dao/mongo/models/product.js";
import CartsManager from "../dao/mongo/managers/cartsManager.js";

const router = new Router();

const productManager = new ProductsManager();
const cartManager = new CartsManager()

//GET PRODUCTS
router.get("/products", async (req, res) => {
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

    const products = docs;
    res.render("home", {
      products,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page: rest.page,
      limit: rest.limit,
    });

  } catch (error) {
    res.status(500).send({ status: "error", message: "Error al obtener productos" });
  }
});

//GET CART BY ID
router.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params
    const cartId = await cartManager.getCartById({ _id: cid })
    if (!cartId) return res.status(404).send({ status: "error", error: "Cart not found" });
    res.render("cart", cartId)
  } catch (error) {
    console.log(error)
  }
});

//Real Time Products
router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

//CHAT
router.get("/chat", (req, res) => {
  res.render("chat");
});

export default router;
