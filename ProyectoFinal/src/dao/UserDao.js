import userModel from "./models/user.model.js"

export default class UsersManager {
    get = (params) => {
        return userModel.find(params).lean();
    };
    getBy = (params) => {
        return userModel.findOne(params).lean();
    };

    save = (user) => {
        return userModel.create(user);
    };

    update = (id, user) => {
        return userModel.findByIdAndUpdate(id, { $set: user });
    };

    delete = (id) => {
        return userModel.findByIdAndDelete(id);
    };
}
