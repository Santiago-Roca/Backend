import fs, { existsSync } from "fs";
import __dirname from "../utils.js";

export default class ProductManager {
  constructor() {
    this.path = `${__dirname}/files/products.json`;
  }

  //READ PRODUCTS
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  };

  //ADD PRODUCT
  addProduct = async (product) => {
    try {
      if (this.validateData(product)) {
        const products = await this.getProducts();
        const exists = products.find((item) => item.code == product.code);
        if (exists == undefined) {
          const lastPosition = products.length - 1;
          products.length == 0
            ? (product.id = 1)
            : (product.id = products[lastPosition].id + 1);
          product.stock = 10;
          product.status = true;
          product.thumbnail = [];
          products.push(product);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, "\t")
          );
          return product;
        }
        return false;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  };

  //RETURN THE PRODUCT BY ID
  getProductsById = async (id) => {
    const products = await this.getProducts();
    const exists = products.find((item) => item.id === id);
    if (exists != undefined) {
      return exists;
    }
    return null;
  };

  //UPTADE PRODUCT
  updateProduct = async (id, product) => {
    const products = await this.getProducts();
    const exists = products.findIndex((item) => item.id === id);
    if (exists != -1) {
      const existCode = products.find((item) => item.code === product.code);
      if (existCode == undefined) {
        product.id = id;
        products[exists] = product;
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        return product;
      }
      return false;
    }
    return "notFound";
  };

  //DELETE A PRODUCT
  deleteProduct = async (id) => {
    const products = await this.getProducts();
    const exists = products.find((item) => item.id === id);
    if (exists != undefined) {
      products.splice(products.indexOf(exists), 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return exists;
    }
    return false;
  };

  //VALIDATING DATA:
  validateData = (product) => {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.status ||
      !product.stock ||
      !product.category ||
      !product.thumbnail
    ) {
      return false;
    }
    return true;
  };
}
