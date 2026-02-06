const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients.controller');
const validate = require('../middleware/validation');
const validators = require('../utils/validators');

// POST /api/clients - Crear cliente
router.post(
    '/',
    validate(validators.client.create),
    clientsController.createClient
);

// GET /api/clients - Listar clientes
router.get('/', clientsController.getAllClients);

// GET /api/clients/:id - Obtener cliente por ID
router.get('/:id', clientsController.getClient);

// PUT /api/clients/:id - Actualizar cliente
router.put(
    '/:id',
    validate(validators.client.update),
    clientsController.updateClient
);

router.delete('/:id', clientsController.deleteClient);

module.exports = router;