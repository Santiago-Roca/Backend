export default class MessageService {
    constructor(dao) {
        this.dao = dao;
    }

    getAllMessages = (params) => {
        return this.dao.get(params);
    }

    createMessage = (message) => {
        return this.dao.save(message);
    }
}