export default class TicketService {
    constructor(dao) {
        this.dao = dao;
    }

    getAllTickets = () => {
        return this.dao.get();
    };

    createTicket = (ticket) => {
        return this.dao.save(ticket);
    };

    getTicketBy = (params) => {
        return this.dao.getBy(params);
    };

    updateTicket = (id, ticket) => {
        return this.dao.update(id, ticket)
    };

    deleteTicket = (id) => {
        return this.dao.delete(id)
    };

}