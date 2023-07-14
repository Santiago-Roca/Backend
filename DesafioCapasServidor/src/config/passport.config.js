import passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import local from 'passport-local';

import gitHubStrategies from "passport-github2"
import {userService} from "../services/repositories.js"

import { createHash, validatePassword } from "../services/auth.js";
import { cookieExtractor } from "../utils.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = Strategy

const initializePassportStrategies = () => {

    //REGISTER
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        try {
            const { firstName, lastName, role, age, cart } = req.body;
            const exists = await userService.getUserBy({ email })
            if (exists) return done(null, false, { message: "User already exists" })
            const hashedPassword = await createHash(password)
            const newUser = {
                firstName,
                lastName,
                email,
                role,
                cart,
                age,
                password: hashedPassword
            }
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
            if (email === "admin@admin.com" && password === '123') {
                resultUser = {
                    name: "Admin",
                    id: 0,
                    role: 'superAdmin'
                }
                return done(null, resultUser)
            }
            const user = await userService.getUserBy({email})
            if (!user) return done(null, false, { message: 'User not found' })
            const isValidPassword = await validatePassword(password, user.password)
            if (!isValidPassword) return done(null, false, { message: "Invalid password" })
            resultUser = {
                name: user.firstName + " " + user.lastName,
                email: user.email,
                id: user._id,
                role: user.role,
                age: user.age,
                cart: user.cart
            }
            return done(null, resultUser)
        } catch (error) {
            return done(error)
        }
    }))

    //PASSPORT GITHUB
    passport.use("github", new gitHubStrategies({
        clientID: "Iv1.af249d5cc59255c7",
        clientSecret: "cd9942468e4b3f31c4e82d8440800d8b593a05aa",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const { name, email } = profile._json
            const user = await userService.getUserBy({ email })

            if (!user) {
                const newUser = {
                    firstName: name,
                    email,
                    password: ''
                }
                const result = await userService.createUser(newUser)
                done(null, result)
            }
            done(null, user)
        } catch (error) {
            done(error)
        }
    }))

    //JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'jwtSecret'
    }, async (payload, done) => {
        try {
            return done(null, payload);
        } catch (error) {
            return done(error)
        }
    }))

};
export default initializePassportStrategies;