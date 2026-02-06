const express = require('express');
const router = express.Router();
const agentsController = require('../controllers/agents.controller');
const validate = require('../middleware/validation');
const validators = require('../utils/validators');

// POST /api/agents - Crear agente
router.post(
    '/',
    validate(validators.agent.create),
    agentsController.createAgent
);

// GET /api/agents - Listar agentes
router.get('/', agentsController.getAllAgents);

// GET /api/agents/:id - Obtener agente por ID
router.get('/:id', agentsController.getAgent);

// PUT /api/agents/:id - Actualizar agente
router.put(
    '/:id',
    validate(validators.agent.update),
    agentsController.updateAgent
);

router.delete('/:id', agentsController.deleteAgent);

module.exports = router;