import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/ProductManager.js";

const router = new Router();

const productManager = new ProductsManager();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

export default router;
