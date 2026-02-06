const Client = require('../models/client.model');
const Ticket = require('../models/ticket.model');

class ClientsService {
    async createClient(data) {
        try {
            // Verificar si el email ya existe
            const existingClient = await Client.findByEmail(data.email);
            if (existingClient) {
                throw { code: 'BUSINESS_ERROR', message: 'Client with this email already exists' };
            }

            return await Client.create(data);
        } catch (error) {
            throw error;
        }
    }

    async getAllClients(page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const clients = await Client.findAll(pageSize, offset);
            const total = await Client.count();
            
            return {
                clients,
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

    async getClientById(id) {
        try {
            const client = await Client.findById(id);
            if (!client) {
                throw { code: 'BUSINESS_ERROR', message: 'Client not found' };
            }
            
            // Obtener tickets del cliente
            const tickets = await Ticket.findByClientId(id);
            client.tickets = tickets;
            
            return client;
        } catch (error) {
            throw error;
        }
    }

    async updateClient(id, data) {
        try {
            const client = await Client.findById(id);
            if (!client) {
                throw { code: 'BUSINESS_ERROR', message: 'Client not found' };
            }

            // Si se actualiza el email, verificar que no exista otro cliente con ese email
            if (data.email && data.email !== client.email) {
                const existingClient = await Client.findByEmail(data.email);
                if (existingClient && existingClient.id !== parseInt(id)) {
                    throw { code: 'BUSINESS_ERROR', message: 'Email already in use by another client' };
                }
            }

            return await Client.update(id, data);
        } catch (error) {
            throw error;
        }
    }

    async deleteClient(id) {
        try {
            const client = await Client.delete(id);
            return client;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new ClientsService();