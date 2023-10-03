import { passportCall } from "../services/auth.js";
import BaseRouter from "./Router.js";
import sessionController from "../controllers/session.controller.js"

export default class SessionRouter extends BaseRouter {
    init() {
        // REGISTER
        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'locals' }), sessionController.register)

        //LOGIN
        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'locals' }), sessionController.login)

        //LOGOUT
        this.post('/logout', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt' }), sessionController.logout)

        //CURRENT
        this.get('/current', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), sessionController.current)

        //RESTORE REQUEST
        this.post('/restoreRequest', ['NO_AUTH'], passportCall('jwt', { strategyType: 'jwt' }), sessionController.restoreRequest)

        //RESTORE PASSWORD
        this.post('/restorePassword', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt' }), sessionController.restorePassword)

    }
}
