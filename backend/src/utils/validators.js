const Joi = require('joi');

const validators = {
    client: {
        create: Joi.object({
            name: Joi.string().min(2).max(100).required(),
            email: Joi.string().email().required()
        }),
        
        update: Joi.object({
            name: Joi.string().min(2).max(100),
            email: Joi.string().email()
        })
    },

    agent: {
        create: Joi.object({
            name: Joi.string().min(2).max(100).required(),
            email: Joi.string().email().required()
        }),
        
        update: Joi.object({
            name: Joi.string().min(2).max(100),
            email: Joi.string().email()
        })
    },

    ticket: {
        create: Joi.object({
            clientId: Joi.number().integer().positive().required(),
            title: Joi.string().min(5).max(200).required(),
            description: Joi.string().min(10).required(),
            status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'RESOLVED').default('OPEN')
        }),

        update: Joi.object({
            title: Joi.string().min(5).max(200),
            description: Joi.string().min(10)
        }),

        assign: Joi.object({
            agentId: Joi.number().integer().positive().required()
        }),

        status: Joi.object({
            status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'RESOLVED').required(),
            resolution: Joi.when('status', {
                is: 'RESOLVED',
                then: Joi.string().min(5).required(),
                otherwise: Joi.string().allow('').optional()
            })
        }),

        filters: Joi.object({
            status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'RESOLVED'),
            clientId: Joi.number().integer().positive(),
            agentId: Joi.number().integer().positive(),
            from: Joi.date().iso(),
            to: Joi.date().iso(),
            page: Joi.number().integer().min(1).default(1),
            pageSize: Joi.number().integer().min(1).max(100).default(10)
        })
    }
};

module.exports = validators;