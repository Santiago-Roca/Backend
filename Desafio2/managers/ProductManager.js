import fs, { existsSync } from "fs";

export default class ProductManager {
  constructor() {
    this.path = "./Desafio2/files/products.json";
  }

  //RETURN THE LIST OF PRODUCTS
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  };

  //ADDING A PRODUCT
  addProduct = async (product) => {
    try {
      if (this.validateData(product)) {
        const products = await this.getProducts();
        const exists = products.find((item) => item.code == product.code);
        if (exists == undefined) {
          // const newProduct = product
          const lastPosition = products.length - 1;
          products.length == 0 ? (product.id = 1) : (product.id = products[lastPosition].id + 1);
          // products.push(product);
          products.push(product);
          // console.log("entre")
          await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
          return product;
        }
        return console.log("Ya exists un producto con ese código");
      }
      return console.log("Faltan datos por ingresar");

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
    console.log("Not found");
    return null;
  };

  //UPTADE PRODUCT
  updateProduct = async (id, atributo, valor) => {
    const products = await this.getProducts();
    const exists = products.find((item) => item.id === id);
    if (exists != undefined) {
      if (Object.keys(exists).includes(atributo)) {
        exists[atributo] = valor
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        console.log("Cambio realizado correctamente!")
      } else {
        console.log("El producto no contiene esa propiedad")
      }
      return exists;
    }
    console.log("Not found");
    return null;
  }

  //DELETE A PRODUCT
  deleteProduct = async (id) => {
    const products = await this.getProducts();
    const exists = products.find((item) => item.id === id);
    if (exists != undefined) {
      products.splice(products.indexOf(exists), 1)
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
    } else {

      console.log("Product not found");
      return null;
    }
  };

  //VALIDATING DATA:
  validateData = (product) => {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock
    ) {
      return false;
    }
    return true;
  };

}

