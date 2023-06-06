import { Router } from "express"
import userModel from "../dao/mongo/models/user.js";
import { createHash } from "../utils.js";

const router = Router()

//REGISTER
router.post('/register', async (req, res) => {
    const result = await userModel.create(req.body)
    res.send({ status: "success", payload: result });
});

//POST LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (email == "admin@admin.com" && password === "admin") {
        req.session.user = {
            name: "Admin",
            role: "admin",
            email: "..."
        }
    }

    //Buscar al usuario:
    const user = await userModel.findOne({ email, password })
    if (!user) return res.status(400).send({ status: "error", error: "Usuario o contraseña incorrecta" })

    //Creando sesion:
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
    }
    res.send({ status: "login success" })
})

export default router; 