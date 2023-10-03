import messageModel from "./models/message.model.js"

export default class MessagesManager {
  get = (params) => {
    return messageModel.find(params).lean();
  };

  save = (message) => {
    return messageModel.create(message);
  };
}
