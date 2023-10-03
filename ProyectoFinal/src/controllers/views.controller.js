import jwt from 'jsonwebtoken';
import productModel from "../dao/models/product.model.js";
import config from '../config/config.js';
import { userService, cartService } from '../services/repositories.js';
import getUsersDTO from '../dto/User/getUsersDTO.js';
import UserDTO from '../dto/User/UserDTO.js';
import userCartDTO from '../dto/User/userCartDTO.js';


//GET PRODUCTS
const getProducts = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const { limit = 15 } = req.query;
        const { sort } = req.query;

        let ordenar = ''

        if (sort == 1 || sort == -1 || sort == 'asc' || sort == 'desc') {
            ordenar = { price: sort }
        }

        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({}, {
            page, limit, sort: ordenar, lean: true
        });

        const products = docs;
        const user = userCartDTO.getFrom(req.user)
        res.render("products", {
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page: rest.page,
            limit: rest.limit,
            user
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al obtener productos" });
    }
}

//GET PRODUCTS ADMIN
const getProductsAdmin = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const { limit = 15 } = req.query;
        const { sort } = req.query;

        let ordenar = ''

        if (sort == 1 || sort == -1 || sort == 'asc' || sort == 'desc') {
            ordenar = { price: sort }
        }

        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({}, {
            page, limit, sort: ordenar, lean: true
        });

        const products = docs;
        const user = userCartDTO.getFrom(req.user)
        res.render("productsAdmin", {
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page: rest.page,
            limit: rest.limit,
            user
        });

    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al obtener productos" });
    }
}

//GET USERS
const getUsers = async (req, res) => {
    try {
        const user = UserDTO.getFrom(req.user)
        const users = await userService.getAllUsers()
        const usersDTO = getUsersDTO.getFrom(users)
        res.render('users', { user, usersDTO })
    } catch (error) {
        console.log(error)
    }
}

//REGISTER
const register = (req, res) => {
    res.render('register')
}

//MENU ADMIN
const getMenuAdmin = (req, res) => {
    res.render('menuAdmin')
}

//LOGIN
const login = (req, res) => {
    res.render('login')
}

//CURRENT
const current = (req, res) => {
    let user = req.user
    res.render('current', { user })
}

//GET CART BY ID
const getCartById = async (req, res) => {
    let cartUser = req.user.cart
    let cartID = cartUser._id
    const cart = await cartService.getCartById({ _id: cartID })
    const products = cart.products
    res.render("cart", { products })
};

//RESTORE REQUEST
const restoreRequest = (req, res) => {
    res.render('restoreRequest')
}

//RESTORE PASSWORD
const restorePassword = (req, res) => {
    const { token } = req.query;
    try {
        const validToken = jwt.verify(token, config.jwt.SECRET)
        res.render('restorePassword')
    } catch (error) {
        return res.render('invalidToken')
    }
}

//COMPLETE PURCHASE
const completePurchase = (req, res) => {
    res.render('completePurchase')
}

export default {
    getProducts, register, login, current, getCartById, restoreRequest, restorePassword, getUsers, getMenuAdmin, completePurchase, getProductsAdmin
}

