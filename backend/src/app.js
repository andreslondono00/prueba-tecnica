const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Importar rutas
const clientsRoutes = require('./routes/clients.routes');
const agentsRoutes = require('./routes/agents.routes');
const ticketsRoutes = require('./routes/tickets.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Support Ticket API',
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/clients', clientsRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/tickets', ticketsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/`);
});

module.exports = app;