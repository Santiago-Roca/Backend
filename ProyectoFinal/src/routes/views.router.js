import { passportCall, permisions } from "../services/auth.js";
import BaseRouter from "./Router.js";
import viewsController from "../controllers/views.controller.js";
import { privacy } from "../services/auth.js"


export default class ViewsRouter extends BaseRouter {
  init() {

    //MENU ADMIN
    this.get('/menuAdmin', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN'), viewsController.getMenuAdmin)

    //GET USERS
    this.get('/users', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN'), viewsController.getUsers);

    //GET PRODUCTS
    this.get('/products', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), privacy("PRIVATE"), permisions('USER_PREMIUM'), viewsController.getProducts);

    //GET PRODUCTS ADMIN
    this.get('/productsAdmin', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN'), viewsController.getProductsAdmin);

    //REGISTER
    this.get('/register', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), privacy("NO_AUTHENTICATED"), viewsController.register);

    //LOGIN
    this.get('/login', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), privacy("NO_AUTHENTICATED"), viewsController.login);

    //CURRENT
    this.get('/current', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), privacy("NO_AUTHENTICATED"), viewsController.current);

    //GET CART
    this.get('/cart', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('USER_PREMIUM'), viewsController.getCartById);

    //COMPLETE PURCHASE
    this.get('/completePurchase', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('USER_PREMIUM'), viewsController.completePurchase);

    //RESTORE REQUEST
    this.get('/restoreRequest', ['PUBLIC'], viewsController.restoreRequest)

    //RESTORE PASSWORD
    this.get('/restorePassword', ['NO_AUTH'], viewsController.restorePassword)

  }
}
