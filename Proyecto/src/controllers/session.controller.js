import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { createHash, generateToken, validatePassword } from "../services/auth.js"
import UserDTO from "../dto/User/UserDTO.js";
import DTemplates from "../constant/DTemplates.js";
import MailingService from "../services/MailingService.js";
import RestoreTokenDTO from "../dto/User/RestoreTokenDTO.js";
import { userService } from "../services/repositories.js";
// import UserService from "../services/Repositories/UserRepository.js";

//REGISTER
const register = async (req, res) => {
    const mailingService = new MailingService();
    try {
        let user = req.user
        const result = await mailingService.sendMail(req.user.email, DTemplates.WELCOME, user)
        res.sendSuccess("Registered")
    } catch (error) {
        res.sendInternalError(error);
    }
}

//LOGIN
const login = async (req, res) => {
    const token = generateToken(req.user)
    res.cookie('authToken', token, { maxAge: 1000 * 3600 * 24, httpOnly: true }).send({ status: "Logged in" })
}

//CURRENT
const current = (req, res) => {
    if (!req.user) return res.sendUnauthorized("User not logged in")
    const user = req.user
    const userCurrent = new UserDTO(user)
    res.send({ status: "Success", payload: userCurrent })
}

//RESTORE REQUEST
const restoreRequest = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.sendBadRequest('No se proporcionó un email');
    const user = await userService.getUserBy({ email: email });
    if (!user) return res.sendBadRequest('Email no válido');
    //Hasta aquí todo bien. Crear un restoreToken.
    const restoreToken = generateToken(RestoreTokenDTO.getFrom(user), '1h');
    //Guardar el Token en mi WhiteList
    const mailingService = new MailingService();
    const result = await mailingService.sendMail(user.email, DTemplates.RESTORE, { restoreToken })
    res.sendSuccess('Correo enviado')
}

//RESTORE PASSWORD
const restorePassword = async (req, res) => {
    const { password, token } = req.body;
    try {
        const tokenUser = jwt.verify(token, config.jwt.SECRET);
        const user = await userService.getUserBy({ email: tokenUser.email });
        //Verificar que la contraseña no sea la misma que ya tenemos
        const isSamePassword = await validatePassword(password, user.password);
        if (isSamePassword) return res.sendBadRequest('Su contraseña es la misma');
        const newHashedPassword = await createHash(password);
        await userService.updateUser(user._id, { password: newHashedPassword });
        //Aquí borras el token del whitelist
        res.sendSuccess("Contraseña Cambiada");
    } catch (error) {
        console.log(error);
    }
}

export default {
    register, login, current, restoreRequest, restorePassword
}