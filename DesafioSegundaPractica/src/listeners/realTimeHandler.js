import ProductsManager from "../dao/mongo/managers/product.js";

const realTimeProducts = async (io, socket) => {
  console.log("Nuevo socket conectado");
  const products = await new ProductsManager().getProducts();
  socket.emit("products", products);
};

export default realTimeProducts;
