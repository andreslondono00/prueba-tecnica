const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');
const validate = require('../middleware/validation');
const validators = require('../utils/validators');

// POST /api/tickets - Crear ticket
router.post(
    '/',
    validate(validators.ticket.create),
    ticketsController.createTicket
);

// GET /api/tickets - Listar tickets con filtros
router.get(
    '/',
    validate(validators.ticket.filters, 'query'),
    ticketsController.getAllTickets
);

// GET /api/tickets/:id - Obtener ticket por ID
router.get('/:id', ticketsController.getTicket);

// PUT /api/tickets/:id - Actualizar ticket
router.put(
    '/:id',
    validate(validators.ticket.update),
    ticketsController.updateTicket
);

// PATCH /api/tickets/:id/assign - Asignar agente
router.patch(
    '/:id/assign',
    validate(validators.ticket.assign),
    ticketsController.assignAgent
);

// PATCH /api/tickets/:id/status - Cambiar estado
router.patch(
    '/:id/status',
    validate(validators.ticket.status),
    ticketsController.updateStatus
);

module.exports = router;