import { passportCall, permisions } from "../services/auth.js";
import BaseRouter from "./Router.js";
import cartController from "../controllers/cart.controller.js";

export default class CartRouter extends BaseRouter {
    init() {
        //GET CARTS
        this.get('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), cartController.getCarts)

        //GET CART BY ID
        this.get("/:cid", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), cartController.getCartById)

        //POST CART
        this.post("/", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), cartController.createCart)

        //POST (Products on cart)
        this.post("/product/:pid", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), cartController.addProductCart)

        //PUT (Actualizar Quantity)
        this.put("/:cid/product/:pid", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), cartController.updateQuantity)

        //DELETE (Product on cart)
        this.delete("/product/:pid", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('USER_PREMIUM'), cartController.deleteProductCart)

        //DELETE (All Products in cart)
        this.delete("/", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('USER_PREMIUM'), cartController.deleteAllProducts)

        //FINALIZE PURCHASE
        this.post("/purchase", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('USER_PREMIUM'), cartController.finalizePurchase)
    }
}
