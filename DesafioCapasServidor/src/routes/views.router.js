import { passportCall } from "../services/auth.js";
import BaseRouter from "./Router.js";
import viewsController from "../controllers/views.controller.js";
import { privacy } from "../services/auth.js"


export default class ViewsRouter extends BaseRouter {
  init() {
    //GET PRODUCTS
    this.get('/products', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), privacy("PRIVATE"), viewsController.getProducts);

    //REGISTER
    this.get('/register', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), privacy("NO_AUTHENTICATED"), viewsController.register);

    //LOGIN
    this.get('/login', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), privacy("NO_AUTHENTICATED"), viewsController.login);

    //CURRENT
    this.get('/current', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), viewsController.current);

    //GET CART BY ID
    this.get('/cart/:cid', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), viewsController.getCartById);

    //Real Time Products
    this.get('/realtimeproducts', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), viewsController.realTimeProducts);

    // //CHAT
    this.get('/chat', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), viewsController.chat);
  }
}
