import passport from 'passport';
import local from 'passport-local';
import userModel from '../dao/mongo/models/user.js';
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