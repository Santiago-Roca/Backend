import ticketModel from "./models/ticket.model.js";

export default class TicketManager {
    get = (params) => {
      return ticketModel.find(params).lean();
    };
  
    getBy = (params) => {
      return ticketModel.findOne(params).lean();
    };
  
    save = (ticket) => {
      return ticketModel.create(ticket);
    };
  
    update = (id, ticket) => {
      return ticketModel.findByIdAndUpdate(id, { $set: ticket });
    };
  
    delete = (id) => {
      return ticketModel.findByIdAndDelete(id);
    };
  
  }