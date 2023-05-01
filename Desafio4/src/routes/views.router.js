import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = new Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

export default router;
