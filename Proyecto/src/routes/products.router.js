import { passportCall, permisions } from "../services/auth.js";
import BaseRouter from "./Router.js";
import productControllers from "../controllers/product.controllers.js";

export default class ProductRouter extends BaseRouter {
    init() {
        //MOCKS
        this.get('/mockingproducts', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), productControllers.getMocks)

        //GET BY ID
        this.get('/:pid', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), productControllers.getProductsById)

        //GET PRODUCTS
        this.get('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), productControllers.getProducts)

        //CATEGORY FILTER
        this.get('/:category', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), productControllers.getProductsByCategory)

        // //POST
        this.post('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN', 'PREMIUM'), productControllers.createProduct)

        // // //PUT
        this.put('/:pid', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN'), productControllers.updateProduct)

        // //DELETE
        this.delete('/:pid', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN', 'PREMIUM'), productControllers.deleteProduct)


    }
}
