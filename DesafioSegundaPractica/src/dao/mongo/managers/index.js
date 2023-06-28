import UsersManager from "./user.js";
import CartsManager from "./carts.js";
import ProductsManager from "./product.js";
import MessagesManager from "./message.js";

export const userServices = new UsersManager();
export const cartServices = new CartsManager();
export const productServices = new ProductsManager();
export const messagesService = new MessagesManager();
