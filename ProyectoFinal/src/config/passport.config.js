import passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import local from 'passport-local';

import { cartService, userService } from "../services/repositories.js"

import { createHash, validatePassword } from "../services/auth.js";
import { cookieExtractor } from "../utils.js";
import config from './config.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = Strategy

const initializePassportStrategies = () => {

    //REGISTER
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        try {
            const { firstName, lastName, role, age } = req.body;
            const exists = await userService.getUserBy({ email })
            if (exists) return done(null, false, { message: "User already exists" })
            const hashedPassword = await createHash(password)
            //Le creo un carrito al usuario que se registra por primera vez:
            const cartUser = await cartService.createCart({ products: [] })
            const newUser = {
                firstName,
                lastName,
                role,
                age,
                email,
                cart: cartUser,
                password: hashedPassword,
                lastConecction: new Date()
            };
            const result = await userService.createUser(newUser)
            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))

    //LOGIN
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        let resultUser;
        try {
            if (email === "admin@admin.com" && password === 'admin') {
                resultUser = {
                    name: "Admin",
                    id: 0,
                    role: 'admin',
                    email: 'admin@admin.com'
                }
                return done(null, resultUser)
            }
            const user = await userService.getUserBy({ email })
            if (!user) return done(null, false, { message: 'User not found' })
            const isValidPassword = await validatePassword(password, user.password)
            if (!isValidPassword) return done(null, false, { message: "Invalid password" })
            resultUser = {
                name: user.firstName + " " + user.lastName,
                email: user.email,
                id: user._id,
                role: user.role,
                age: user.age,
                cart: user.cart,
                lastConecction: new Date()
            }
            return done(null, resultUser)
        } catch (error) {
            return done(error)
        }
    }))

    //JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwt.SECRET
    }, async (payload, done) => {
        try {
            return done(null, payload);
        } catch (error) {
            return done(error)
        }
    }))

};
export default initializePassportStrategies;