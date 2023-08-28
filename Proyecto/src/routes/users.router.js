import { passportCall } from "../services/auth.js";
import BaseRouter from "./Router.js";
import userController from "../controllers/user.controller.js";

export default class UserRouter extends BaseRouter {
    init() {

        //GET USERS
        this.get('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), userController.getUsers)

        //CAMBIAR ROL DE USUARIO (PREMIUM A USER Y VICEVERSA)
        this.post('/premium/:uid', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), userController.changeRol)

    }
}
