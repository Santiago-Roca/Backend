import ProductsManager from "../dao/mongo/managers/ProductManager.js";
import MessagesManager from "../dao/mongo/managers/messagesManager.js";
import UsersManager from "../dao/mongo/managers/userManager.js";
import CartsManager from "../dao/mongo/managers/cartsManager.js";

import ProductService from "./products.services.js";
import CartService from "./carts.services.js"
import UserService from "./users.services.js";

export const messagesService = new MessagesManager();
export const userService = new UserService(new UsersManager);
export const productService = new ProductService(new ProductsManager())
export const cartService = new CartService(new CartsManager())
