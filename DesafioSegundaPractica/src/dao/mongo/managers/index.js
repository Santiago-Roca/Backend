import UsersManager from "./userManager.js";
import CartsManager from "./cartsManager.js";
import ProductsManager from "./ProductManager.js";
import MessagesManager from "./messagesManager.js";

export const userServices = new UsersManager();
export const cartServices = new CartsManager();
export const productServices = new ProductsManager();
export const messagesService = new MessagesManager();
