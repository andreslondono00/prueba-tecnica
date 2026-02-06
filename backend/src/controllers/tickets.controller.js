const ticketsService = require('../services/tickets.service');

class TicketsController {
    async createTicket(req, res, next) {
        try {
            const ticket = await ticketsService.createTicket(req.body);
            res.status(201).json({
                success: true,
                data: ticket
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllTickets(req, res, next) {
        try {
            const filters = req.query;
            const result = await ticketsService.getAllTickets(filters);
            res.json({
                success: true,
                data: result.tickets,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async getTicket(req, res, next) {
        try {
            const ticket = await ticketsService.getTicketById(req.params.id);
            res.json({
                success: true,
                data: ticket
            });
        } catch (error) {
            next(error);
        }
    }

    async assignAgent(req, res, next) {
        try {
            const ticket = await ticketsService.assignAgent(
                req.params.id, 
                req.body.agentId
            );
            res.json({
                success: true,
                data: ticket
            });
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const ticket = await ticketsService.updateTicketStatus(
                req.params.id,
                req.body.status,
                req.body.resolution
            );
            res.json({
                success: true,
                data: ticket
            });
        } catch (error) {
            next(error);
        }
    }

    async updateTicket(req, res, next) {
        try {
            const ticket = await ticketsService.updateTicket(
                req.params.id,
                req.body
            );
            res.json({
                success: true,
                data: ticket
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TicketsController();