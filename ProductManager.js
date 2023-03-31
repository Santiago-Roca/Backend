class ProductManager {
  constructor() {
    this.products = [];
  }

  //ADD A PRODUCT
  addProduct = ({ title, description, price, thumbnail, code, stock }) => {
    if (this.validateData(title, description, price, thumbnail, code, stock)) {
      const exists = this.products.find((item) => item.code == code);
      if (exists == undefined) {
        const product = { title, description, price, thumbnail, code, stock };
        const lastPosition = this.products.length - 1;
        this.products.length === 0
          ? (product.id = 1)
          : (product.id = this.products[lastPosition].id + 1);
        this.products.push(product);
      } else {
        console.log("Ya exists un producto con ese código");
      }
    } else {
      console.log("Faltan datos por ingresar");
    }
  };

  //VALIDATING DATA:
  validateData = (title, description, price, thumbnail, code, stock) => {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return false;
    } else {
      return true;
    }
  };

  //RETURN THE LIST
  getProducts = () => {
    return this.products;
  };

  //RETURN THE PRODUCT BY ID
  getProductsById = (id) => {
    const exists = this.products.find((item) => item.id === id);
    if (exists != undefined) {
      return exists;
    }
    console.log("Not found");
    return null;
  };
}


//CREATING SOME PRODUCTS:
product1 = {
  title: "Jabón",
  description: "personal",
  price: 800,
  thumbnail: "sin imagen",
  code: "abc1",
  stock: 10,
};
product2 = {
  title: "Atun",
  description: "alimento",
  price: 500,
  thumbnail: "sin imagen",
  code: "abc2",
  stock: 10,
};
product3 = {
  title: "Esponja",
  description: "limpieza",
  price: 200,
  thumbnail: "sin imagen",
  code: "abc3",
  stock: 10,
};

const listaProductos = new ProductoManager();

console.log(listaProductos.getProducts());

listaProductos.addProduct(product1)
listaProductos.addProduct(product1)
listaProductos.addProduct(product2)
listaProductos.addProduct(product3)

console.log(listaProductos.getProducts());

console.log(listaProductos.getProductsById(2));
console.log(listaProductos.getProductsById(5));
