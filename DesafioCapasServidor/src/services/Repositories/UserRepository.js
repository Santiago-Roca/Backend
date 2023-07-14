export default class UserService {
    constructor(dao) {
        this.dao = dao;
    }

    getAllUsers = (params) => {
        return this.dao.get(params);
    };

    createUser = (user) => {
        return this.dao.save(user);
    };

    getUserBy = (user) => {
        return this.dao.getBy(user);
    };

    updateUser = (id, user) => {
        return this.dao.update(id, user)
    };

    deleteUser = (id) => {
        return this.dao.delete(id)
    };

}