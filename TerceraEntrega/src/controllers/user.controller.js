import { userService } from "../services/repositories.js";

//GET USERS
const getUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    res.send({ status: "Success", payload: users });
};

//POST USER
const createUser = async (req, res) => {
    const user = req.body;
    const result = await userService.createUser(user);
    res.send({ status: "Success", payload: result });
};

export default {
    getUsers,
    createUser,
};
