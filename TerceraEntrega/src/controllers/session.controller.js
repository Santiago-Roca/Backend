import { generateToken } from "../services/auth.js"
import UserDTO from "../dao/DTOs/userDTO.js"

//REGISTER
const register = (req, res) => {
    res.sendSuccess("Register success")
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

export default {
    register, login, current
}