const clientsService = require('../services/clients.service');

class ClientsController {
    async createClient(req, res, next) {
        try {
            const client = await clientsService.createClient(req.body);
            res.status(201).json({
                success: true,
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllClients(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            
            const result = await clientsService.getAllClients(page, pageSize);
            res.json({
                success: true,
                data: result.clients,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async getClient(req, res, next) {
        try {
            const client = await clientsService.getClientById(req.params.id);
            res.json({
                success: true,
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    async updateClient(req, res, next) {
        try {
            const client = await clientsService.updateClient(req.params.id, req.body);
            res.json({
                success: true,
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteClient(req, res, next) {
        try {
            const client = await clientsService.deleteClient(req.params.id);
            res.json({
                success: true,
                data: client
            });
        } catch (error) {
            next(error);
        }
    }


}

module.exports = new ClientsController();