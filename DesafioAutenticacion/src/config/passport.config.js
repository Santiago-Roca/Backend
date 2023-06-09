import passport from 'passport';
import local from 'passport-local';
import userModel from '../dao/mongo/models/user.js';
import gitHubStrategies from "passport-github2"
import { createHash, validatePassword } from '../utils.js';

const LocalStrategy = local.Strategy;

const initializePassportStrategies = () => {

    //REGISTER
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name } = req.body;
                const exists = await userModel.findOne({ email });
                if (exists) return done(null, false, { message: 'User already exists' });
                const hashedPassword = await createHash(password);
                const user = {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                };
                const result = await userModel.create(user);
                done(null, result);
            } catch (error) {
                done(error);
            }
        }
    ));

    //LOGIN
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        if (email === 'admin@admin.com' && password === 'admin') {
            const user = {
                id: 0,
                name: `Admin`,
                role: 'admin',
                email: '...',
            };
            return done(null, user);
        }

        let user;
        user = await userModel.findOne({ email });
        if (!user) return done(null, false, { message: 'Credenciales incorrectas' });

        const isValidPassword = await validatePassword(password, user.password);
        if (!isValidPassword) return done(null, false, { message: 'Contraseña incorrecta' });

        user = {
            id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
        };
        return done(null, user);
    }));

    //PASSPORT GITHUB
    passport.use("github", new gitHubStrategies({
        clientID: "Iv1.af249d5cc59255c7",
        clientSecret: "cd9942468e4b3f31c4e82d8440800d8b593a05aa",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const { name, email } = profile._json
            const user = await userModel.findOne({ email })
            if (!user) {
                const newUser = {
                    first_name: name,
                    email,
                    password: ''
                }
                const result = await userModel.create(newUser)
                done(null, result)
            }
            done(null, user)
        } catch (error) {
            done(error)
        }
    }))

    //SERIALIZE Y DESEARIALIZE
    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });
    passport.deserializeUser(async function (id, done) {
        if (id === 0) {
            return done(null, {
                role: "admin",
                name: "ADMIN"
            })
        }
        const user = await userModel.findOne({ _id: id });
        return done(null, user);
    });

};
export default initializePassportStrategies;