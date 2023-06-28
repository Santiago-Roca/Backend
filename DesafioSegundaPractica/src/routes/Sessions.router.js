import { generateToken, passportCall } from "../services/auth.js";
import BaseRouter from "./Router.js";

export default class SessionRouter extends BaseRouter {
    init() {
        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'locals' }), (req, res) => {
            res.sendSuccess("Register success")
        })
        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'locals' }), (req, res) => {
            const token = generateToken(req.user)
            res.cookie('authToken', token, { maxAge: 1000 * 3600 * 24, httpOnly: true }).sendSuccess("Logged in")
        })

        this.get('/current', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), (req, res) => {
            res.send(req.user)
        })
    }
}