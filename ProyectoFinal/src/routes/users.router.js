import { passportCall, permisions } from "../services/auth.js";
import BaseRouter from "./Router.js";
import userController from "../controllers/user.controller.js";

export default class UserRouter extends BaseRouter {
    init() {

        //GET USERS
        this.get('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN'), userController.getUsers)

        //DELETE INACTIVE USERS
        this.delete('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), userController.deleteInactiveUsers)

        //DELETE USER
        this.delete('/:email', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN'), userController.deleteUser)

        //CAMBIAR ROL DE USUARIO (PREMIUM A USER Y VICEVERSA)
        this.post('/role/:email', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), permisions('ADMIN'), userController.changeRol)

    }
}
