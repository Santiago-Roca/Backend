import DTemplates from "../constant/DTemplates.js";
import getUsersDTO from "../dto/User/getUsersDTO.js";
import MailingService from "../services/MailingService.js";
import { userService } from "../services/repositories.js";

//GET USERS
const getUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    const userResponse = getUsersDTO.getFrom(users)
    res.send({ status: "success", payload: userResponse });
};

//DELETE INACTIVE USERS
const deleteInactiveUsers = async (req, res) => {
    try {
        let today = new Date()
        const mailingService = new MailingService();
        const users = await userService.getAllUsers()
        users.forEach(async user => {
            let ultimaConexion = new Date(user.lastConecction)
            let differenceDays = ((today.getTime() - ultimaConexion.getTime()) / 1000 / 60 / 60 / 24)

            if (differenceDays >= 2) {
                await mailingService.sendMail(user.email, DTemplates.DELETE, { user: user.firstName })
                await userService.deleteUser(user._id)
            }
        });
        res.send({ status: "success" });
    } catch (error) {
        console.log(error)
    }
}

//DELETE USER
const deleteUser = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userService.getUserBy({ email: email })
        await userService.deleteUser(user._id)
        res.send({ status: "success", message: "Usuario Eliminado" });
    } catch (error) {
        console.log(error)
    }
}

//CHANGE ROL
const changeRol = async (req, res) => {
    const email = req.params.email;
    const user = await userService.getUserBy({ email: email })
    if (user.role === "user") {
        user.role = "premium"
    } else {
        user.role = "user"
    }
    await userService.updateUser(user._id, user)
    res.send({ status: "success", payload: user });
}

export default {
    getUsers,
    deleteInactiveUsers,
    deleteUser,
    changeRol
};
