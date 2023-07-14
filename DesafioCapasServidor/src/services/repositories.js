import ProductRepository from "./Repositories/ProductRepository.js"
import CartRepository from "./Repositories/CartRepository.js"
import UserRepository from "./Repositories/UserRepository.js"
import MessageRepository from "./Repositories/MessageRepository.js"

import ProductDao from "../dao/ProductDao.js";
import UserDao from "../dao/UserDao.js";
import CartDao from "../dao/CartDao.js";
import MessageDao from "../dao/MessageDao.js";

export const userService = new UserRepository(new UserDao);
export const productService = new ProductRepository(new ProductDao())
export const cartService = new CartRepository(new CartDao())
export const messagesService = new MessageRepository(new MessageDao());
