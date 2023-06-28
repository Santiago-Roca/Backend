import passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import local from 'passport-local';

import { userServices } from "../dao/mongo/managers/index.js"
import { createHash, validatePassword } from "../services/auth.js";
import { cookieExtractor } from "../utils.js";
// import gitHubStrategies from "passport-github2"

const LocalStrategy = local.Strategy;
const JWTStrategy = Strategy

const initializePassportStrategies = () => {

    //REGISTER
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        try {
            const { firstName, lastName, role, age, cart } = req.body;
            const exists = await userServices.getUserBy({ email })
            if (exists) return done(null, false, { message: "User already exists" })
            const hashedPassword = await createHash(password)
            const newUser = {
                // name: `${firstName} ${lastName}`,
                firstName,
                lastName,
                email,
                role,
                age,
                password: hashedPassword
            }
            const result = await userServices.createUser(newUser)
            // console.log(newUser) //PUSE ESTO
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
                //Acaba de entrar como SUPER ADMIN
                resultUser = {
                    name: "Admin",
                    id: 0,
                    role: 'superAdmin'
                }
                return done(null, resultUser)
            }
            const user = await userServices.getUserBy({ email })
            if (!user) return done(null, false, { message: 'User not found' })
            const isValidPassword = await validatePassword(password, user.password)
            if (!isValidPassword) return done(null, false, { message: "Invalid password" })
            resultUser = {
                name: user.firstName + " " + user.lastName,                 
                // name: user.name,
                email: user.email,
                id: user._id,
                role: user.role,
                age: user.age
            }
            // console.log(user)
            // console.log(resultUser.name)
            // console.log(req.user)
            // console.log(resultUser)
            return done(null, resultUser)
        } catch (error) {
            return done(error)
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



    // //PASSPORT GITHUB
    // passport.use("github", new gitHubStrategies({
    //     clientID: "Iv1.af249d5cc59255c7",
    //     clientSecret: "cd9942468e4b3f31c4e82d8440800d8b593a05aa",
    //     callbackURL: "http://localhost:8080/api/session/githubcallback"
    // }, async (accessToken, refreshToken, profile, done) => {
    //     try {
    //         const { name, email } = profile._json
    //         const user = await userModel.findOne({ email })
    //         if (!user) {
    //             const newUser = {
    //                 first_name: name,
    //                 email,
    //                 password: ''
    //             }
    //             const result = await userModel.create(newUser)
    //             done(null, result)
    //         }
    //         done(null, user)
    //     } catch (error) {
    //         done(error)
    //     }
    // }))


    // //SERIALIZE Y DESEARIALIZE
    // passport.serializeUser(function (user, done) {
    //     return done(null, user.id);
    // });
    // passport.deserializeUser(async function (id, done) {
    //     if (id === 0) {
    //         return done(null, {
    //             role: "admin",
    //             name: "ADMIN"
    //         })
    //     }
    //     const user = await userModel.findOne({ _id: id });
    //     return done(null, user);
    // });