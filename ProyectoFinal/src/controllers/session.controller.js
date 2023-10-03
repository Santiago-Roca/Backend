import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { createHash, generateToken, validatePassword } from "../services/auth.js"
import DTemplates from "../constant/DTemplates.js";
import MailingService from "../services/MailingService.js";
import RestoreTokenDTO from "../dto/User/RestoreTokenDTO.js";
import { userService } from "../services/repositories.js";

//REGISTER
const register = async (req, res) => {
    const mailingService = new MailingService();
    try {
        let user = req.user
        await mailingService.sendMail(req.user.email, DTemplates.WELCOME, { user: user.firstName })
        res.sendSuccess("Registered")
    } catch (error) {
        res.sendInternalError(error);
    }
}

//LOGIN
const login = async (req, res) => {
    try {
        let user = req.user
        const token = generateToken(req.user)
        res.cookie(config.jwt.COOKIE, token, { maxAge: 1000 * 3600 * 24, httpOnly: true })
        if (user.role == "admin") {
            return res.send({ status: "Logged in Admin" })
        }
        res.send({ status: "Logged in" })

    } catch (error) {
        console.log(error)
    }
}

//LOGOUT
const logout = async (req, res) => {
    try {
        const user = req.user
        if (user.role != "admin") {
            //ACTUALIZO SERVER
            user.lastConecction = new Date()
            const result = await userService.updateUser(user.id, user);
        }
        //LIMPIAR LA COOKIE
        res.clearCookie(`${config.jwt.COOKIE}`, { path: '/' });
        res.send({ status: "Logout" })
    } catch (error) {
        console.log(error)
    }
}

//CURRENT
const current = async (req, res) => {
    if (!req.user) return res.sendUnauthorized("User not logged in")
    const user = req.user
    if (user.role === "admin") return res.send({ status: "success", payload: user })
    const userUpdated = await userService.getUserBy({ email: user.email });
    res.send({ status: "success", payload: userUpdated })
}

//RESTORE REQUEST
const restoreRequest = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.sendBadRequest('No se proporcionó un email');
    const user = await userService.getUserBy({ email: email });
    if (!user) return res.sendBadRequest('Email no válido');
    //Creo un restoreToken.
    const restoreToken = generateToken(RestoreTokenDTO.getFrom(user), '1h');
    const mailingService = new MailingService();
    await mailingService.sendMail(user.email, DTemplates.RESTORE, { restoreToken })
    res.send({ status: "success", message: "Correo enviado" })
}

//RESTORE PASSWORD
const restorePassword = async (req, res) => {
    const { password, token } = req.body;
    try {
        const tokenUser = jwt.verify(token, config.jwt.SECRET);
        const user = await userService.getUserBy({ email: tokenUser.email });
        //Verificar que la contraseña no sea la misma
        const isSamePassword = await validatePassword(password, user.password);
        if (isSamePassword) return res.sendBadRequest('Su contraseña es la misma');
        const newHashedPassword = await createHash(password);
        await userService.updateUser(user._id, { password: newHashedPassword });
        res.send({ status: "success", message: "Contraseña cambiada con éxito" })
    } catch (error) {
        console.log(error);
    }
}

export default {
    register, login, logout, current, restoreRequest, restorePassword
}