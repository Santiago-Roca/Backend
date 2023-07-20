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
        this.post("/:cid/product/:pid", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('USER'), cartController.addProductCart)

        //PUT (Actualizar Quantity)
        this.put("/:cid/product/:pid", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), cartController.updateQuantity)

        //DELETE (Product on cart)
        this.delete("/:cid/product/:pid", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), cartController.deleteProductCart)

        //DELETE (All Products in cart)
        this.delete("/:cid", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), cartController.deleteAllProducts)

        //FINALIZE PURCHASE
        this.post("/:cid/purchase", ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('USER'), cartController.finalizePurchase)
    }
}
