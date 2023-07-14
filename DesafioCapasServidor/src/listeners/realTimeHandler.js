import { productService } from "../services/repositories.js";

const realTimeProducts = async (io, socket) => {
  console.log("Nuevo socket conectado");
  const products = await new productService.getAllProducts();
  socket.emit("products", products);
};

export default realTimeProducts;
