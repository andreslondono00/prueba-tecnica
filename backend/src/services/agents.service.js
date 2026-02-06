const Agent = require('../models/agent.model');
const Ticket = require('../models/ticket.model');

class AgentsService {
    async createAgent(data) {
        try {
            // Verificar si el email ya existe
            const existingAgent = await Agent.findByEmail(data.email);
            if (existingAgent) {
                throw { code: 'BUSINESS_ERROR', message: 'Agent with this email already exists' };
            }

            return await Agent.create(data);
        } catch (error) {
            throw error;
        }
    }

    async getAllAgents(page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const agents = await Agent.findAll(pageSize, offset);
            const total = await Agent.count();

            return {
                agents,
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

    async getAgentById(id) {
        try {
            const agent = await Agent.findById(id);
            if (!agent) {
                throw { code: 'BUSINESS_ERROR', message: 'Agent not found' };
            }

            // Obtener métricas del agente
            const ticketsInProgress = await Ticket.countByAgentAndStatus(id, 'IN_PROGRESS');
            const ticketsResolved = await Ticket.countByAgentAndStatus(id, 'RESOLVED');
            const totalTickets = await Ticket.countByAgent(id);

            agent.metrics = {
                ticketsInProgress,
                ticketsResolved,
                totalTickets
            };

            return agent;
        } catch (error) {
            throw error;
        }
    }

    async updateAgent(id, data) {
        try {
            const agent = await Agent.findById(id);
            if (!agent) {
                throw { code: 'BUSINESS_ERROR', message: 'Agent not found' };
            }

            // Si se actualiza el email, verificar que no exista otro agente con ese email
            if (data.email && data.email !== agent.email) {
                const existingAgent = await Agent.findByEmail(data.email);
                if (existingAgent && existingAgent.id !== parseInt(id)) {
                    throw { code: 'BUSINESS_ERROR', message: 'Email already in use by another agent' };
                }
            }

            return await Agent.update(id, data);
        } catch (error) {
            throw error;
        }
    }

    async deleteAgent(id) {
        try {
            const agent = await Agent.delete(id);
            return agent;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AgentsService();