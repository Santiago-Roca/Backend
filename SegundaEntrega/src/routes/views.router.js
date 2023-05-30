import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/ProductManager.js";
import productModel from "../dao/mongo/models/product.js";

const router = new Router();

const productManager = new ProductsManager();

// VIEJO
// router.get("/", async (req, res) => {
//   const products = await productManager.getProducts();
//   res.render("home", { products });
// });

// VIEJO
router.get("/", async (req, res) => {
  const { params } = req.params;
  const products = await productManager.getProducts({ params });
  console.log(products);
  res.render("home", { products });
});

router.get("/:params", async (req, res) => {
  const { params } = req.params;
  const products = await productManager.getProducts({ title: params });
  res.render("home", { products });
});

router.get("/pid", async (req, res) => {
  console.log("Entre");
  const pid = req.params.pid;
  const products = await productManager.getProductBy({ _id: pid });
  console.log(products);
  // res.render("home", {products});
  // if (!productId) return res.status(404).send({ status: 'error', error: 'Product not found' });
  // res.send({ status: 'success', payload: productId });
  // res.render("home", {products});
});

// const product = await companiesService.getCompanyBy({ _id: cid });
// if (!company)
//   return res.status(404).send({ status: 'error', error: 'Company not found' });
// res.send({ status: 'success', payload: company });

// router.get('/:cid', async (req, res) => {
//   const { cid } = req.params;
//   const company = await companiesService.getCompanyBy({ _id: cid });
//   if (!company)
//     return res.status(404).send({ status: 'error', error: 'Company not found' });
//   res.send({ status: 'success', payload: company });
// });

// router.get("/", async (req, res) => {
// const { page = 1 } = req.query;
// const { limit = 5 } = req.query;
// const { params } = req.params;
// const result = await productManager.getProducts()
// if(params){
//   const result = await productManager.getProducts(params);
// }

// res.render("home", {result});

// const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
//   await productModel.paginate({}, { page, limit, lean: true });

// // console.log(await productModel.paginate({}, { page, limit }));
// const products = docs;
// res.render("home", {
//   products,
//   hasPrevPage,
//   hasNextPage,
//   prevPage,
//   nextPage,
//   page: rest.page,
//   limit: rest.limit,
// });
// });

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

export default router;
