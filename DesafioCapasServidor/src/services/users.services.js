export default class UserService {
    constructor(dao) {
        this.dao = dao;
    }

    getAllUsers = (params) => {
        return this.dao.getUsers(params);
    };

    createUser = (user) => {
        return this.dao.createUser(user);
    };

    getUserBy = (user) => {
        return this.dao.getUserBy(user);
    };

    updateUser = (id, user) => {
        return this.dao.updateUser(id, user)
    };

    deleteUser = (id) => {
        return this.dao.deleteUser(id)
    };

}