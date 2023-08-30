import bcrypt from 'bcrypt'
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

//CREATE HASH
export const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts);
}

//VALIDATE PASSWORD
export const validatePassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

//PASSPORT CALL
export const passportCall = (strategy, options = {}) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) return next(error)
            if (!options.strategyType) {
                req.logger.warning(`Route ${req.url} doesn't have defined a strategyType`);
                return res.sendServerError();
            }
            if (!user) {
                switch (options.strategyType) {
                    case 'jwt':
                        req.error = info.message ? info.message : info.toString;
                        return next();
                    case 'locals':
                        return res.sendUnauthorized(info.message ? info.message : info.toString())
                }
            }
            req.user = user;
            next()
        })(req, res, next);
    }
}

//DELIMITAR PERMISOS
export const permisions = (permisionType) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) return res.sendUnauthorized('Debe ingresar sesion como Administrador o Usuario premium para ejecutar esta acción');
        switch (permisionType) {
            case 'ADMIN':
                if (user.role === 'admin' || user.role === 'premium') next();
                else return res.sendUnauthorized('No tiene los permisos para ejecutar esta acción');
                break;
            case 'PREMIUM':
                if (user.role === 'premium') next();
                else return res.sendUnauthorized('No tiene los permisos para ejecutar esta acción');
                break;
            case 'USER':
                if (user.role === 'user') next();
                else return res.sendUnauthorized('No tiene los permisos para ejecutar esta acción');
        }
    }
}

//GENERATE TOKEN
export const generateToken = (user) => {
    return jwt.sign(user, config.jwt.SECRET, { expiresIn: '1d' })
}

//PRIVACY TO ACCESS
export const privacy = (privacyType) => {
    return (req, res, next) => {
        const user = req.user;
        switch (privacyType) {
            case "PRIVATE":
                if (user) next();
                else res.redirect('/login')
                break;
            case "NO_AUTHENTICATED":
                if (!user) next()
                else res.redirect('/products')
        }
    };
};