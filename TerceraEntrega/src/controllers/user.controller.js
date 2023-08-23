import { userService } from "../services/repositories.js";

//GET USERS
const getUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    res.send({ status: "Success", payload: users });
};

//GET USER BY
const getUserById = async (req, res) => {
    const { uid } = req.params
    const user = await userService.getUserBy({ _id: uid })
    if (!user) return res.status(404).send({ status: "error", error: "User doesn`t exists" });
    res.send({ status: "success", payload: user })
}

//POST USER
const createUser = async (req, res) => {
    const user = req.body;
    const result = await userService.createUser(user);
    res.send({ status: "Success", payload: result });
};

//CHANGE ROL
const changeRol = async (req, res) => {
    const uid = req.params.uid;
    const user = await userService.getUserBy({ _id: uid })
    if (user.role === "user") {
        user.role = "premium"
    } else {
        user.role = "user"
    }
    await userService.updateUser(uid, user)
    res.send({ status: "Success", payload: user });
}

export default {
    getUsers,
    getUserById,
    createUser,
    changeRol
};
