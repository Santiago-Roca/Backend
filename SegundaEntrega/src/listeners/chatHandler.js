import MessagesManager from "../dao/mongo/managers/messagesManager.js";

const messagesService = new MessagesManager();

const registerChatHandler = (io, socket) => {
  const saveMessage = async (message) => {
    await messagesService.createMessage(message);
    const messageLogs = await messagesService.getMessages();
    io.emit("chat:messageLogs", messageLogs);
  };

  const newParticipant = async (user) => {
    socket.broadcast.emit("chat:newConnection", user);
    const messageLogs = await messagesService.getMessages();
    socket.emit("chat:messageLogs", messageLogs);
  };

  socket.on("chat:message", saveMessage);
  socket.on("chat:newParticipant", newParticipant);
};

export default registerChatHandler;
