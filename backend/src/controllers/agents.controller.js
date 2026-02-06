const agentsService = require('../services/agents.service');

class AgentsController {
    async createAgent(req, res, next) {
        try {
            const agent = await agentsService.createAgent(req.body);
            res.status(201).json({
                success: true,
                data: agent
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllAgents(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            
            const result = await agentsService.getAllAgents(page, pageSize);
            res.json({
                success: true,
                data: result.agents,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async getAgent(req, res, next) {
        try {
            const agent = await agentsService.getAgentById(req.params.id);
            res.json({
                success: true,
                data: agent
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAgent(req, res, next) {
        try {
            const agent = await agentsService.updateAgent(req.params.id, req.body);
            res.json({
                success: true,
                data: agent
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAgent(req, res, next) {
        try {
            const agent = await agentsService.deleteAgent(req.params.id);
            res.json({
                success: true,
                data: agent
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AgentsController();