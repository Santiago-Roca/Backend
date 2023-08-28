import { productService } from "../services/repositories.js";

const realTimeProducts = async (io, socket) => {
  req.logger.http("Nuevo socket conectado");
  const products = await new productService.getAllProducts();
  socket.emit("products", products);
};

export default realTimeProducts;
