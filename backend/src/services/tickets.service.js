const Ticket = require('../models/ticket.model');
const Client = require('../models/client.model');
const Agent = require('../models/agent.model');

class TicketsService {
    async createTicket(data) {
        try {
            // Verificar que el cliente existe
            const client = await Client.findById(data.clientId);
            if (!client) {
                throw { code: 'BUSINESS_ERROR', message: 'Client not found' };
            }

            return await Ticket.create(data);
        } catch (error) {
            throw error;
        }
    }

    async getAllTickets(filters = {}) {
        try {
            const page = parseInt(filters.page) || 1;
            const pageSize = parseInt(filters.pageSize) || 10;
            const offset = (page - 1) * pageSize;

            const tickets = await Ticket.findAll({ ...filters, offset, pageSize });
            const total = await Ticket.count(filters);
            
            return {
                tickets,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await Ticket.findById(id);
            if (!ticket) {
                throw { code: 'BUSINESS_ERROR', message: 'Ticket not found' };
            }
            
            return ticket;
        } catch (error) {
            throw error;
        }
    }

    async assignAgent(ticketId, agentId) {
        try {
            // Verificar que el ticket existe
            const ticket = await Ticket.findById(ticketId);
            if (!ticket) {
                throw { code: 'BUSINESS_ERROR', message: 'Ticket not found' };
            }

            // Verificar que el agente existe
            const agent = await Agent.findById(agentId);
            if (!agent) {
                throw { code: 'BUSINESS_ERROR', message: 'Agent not found' };
            }

            // Verificar límite del agente
            const inProgressCount = await Ticket.getAgentInProgressCount(agentId);
            if (inProgressCount >= 5) {
                throw { 
                    code: 'BUSINESS_ERROR', 
                    message: 'Agent cannot have more than 5 tickets in IN_PROGRESS simultaneously' 
                };
            }

            // Asignar agente
            const updated = await Ticket.assignAgent(ticketId, agentId);
            if (!updated) {
                throw { code: 'BUSINESS_ERROR', message: 'Failed to assign agent' };
            }

            return await Ticket.findById(ticketId);
        } catch (error) {
            throw error;
        }
    }

    async updateTicketStatus(ticketId, status, resolution = null) {
        try {
            // Verificar que el ticket existe
            const ticket = await Ticket.findById(ticketId);
            if (!ticket) {
                throw { code: 'BUSINESS_ERROR', message: 'Ticket not found' };
            }

            // Validar cambio de estado
            const validationErrors = await Ticket.validateStatusChange(
                ticket.status,
                status,
                ticket.agent_id,
                resolution
            );

            if (validationErrors.length > 0) {
                throw { 
                    code: 'BUSINESS_ERROR', 
                    message: validationErrors.join(', ') 
                };
            }

            // Actualizar estado
            const updated = await Ticket.updateStatus(ticketId, status, resolution);
            if (!updated) {
                throw { code: 'BUSINESS_ERROR', message: 'Failed to update ticket status' };
            }

            return await Ticket.findById(ticketId);
        } catch (error) {
            throw error;
        }
    }

    async updateTicket(ticketId, data) {
        try {
            // Verificar que el ticket existe
            const ticket = await Ticket.findById(ticketId);
            if (!ticket) {
                throw { code: 'BUSINESS_ERROR', message: 'Ticket not found' };
            }

            // Actualizar ticket
            const updated = await Ticket.update(ticketId, data);
            if (!updated) {
                throw { code: 'BUSINESS_ERROR', message: 'Failed to update ticket' };
            }

            return await Ticket.findById(ticketId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TicketsService();