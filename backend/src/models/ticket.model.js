const pool = require('../config/database');

class Ticket {
    static async create(ticketData) {
        const [result] = await pool.execute(
            `INSERT INTO tickets (client_id, title, description, status) 
             VALUES (?, ?, ?, ?)`,
            [
                ticketData.clientId,
                ticketData.title,
                ticketData.description,
                ticketData.status || 'OPEN'
            ]
        );
        return this.findById(result.insertId);
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT t.*, c.name as client_name, c.email as client_email, 
                    a.name as agent_name, a.email as agent_email
             FROM tickets t
             LEFT JOIN clients c ON t.client_id = c.id
             LEFT JOIN agents a ON t.agent_id = a.id
             WHERE t.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findAll(filters = {}) {
        let query = `
            SELECT t.*, c.name as client_name, c.email as client_email,
                   a.name as agent_name, a.email as agent_email
            FROM tickets t
            LEFT JOIN clients c ON t.client_id = c.id
            LEFT JOIN agents a ON t.agent_id = a.id
            WHERE 1=1
        `;
        const params = [];

        // Aplicar filtros
        if (filters.status) {
            query += ' AND t.status = ?';
            params.push(filters.status);
        }
        if (filters.clientId) {
            query += ' AND t.client_id = ?';
            params.push(filters.clientId);
        }
        if (filters.agentId) {
            query += ' AND t.agent_id = ?';
            params.push(filters.agentId);
        }
        if (filters.from) {
            query += ' AND t.created_at >= ?';
            params.push(filters.from);
        }
        if (filters.to) {
            query += ' AND t.created_at <= ?';
            params.push(filters.to);
        }

        query += ' ORDER BY t.created_at DESC';

        // Paginación
        if (filters.pageSize && filters.offset !== undefined) {
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.pageSize), parseInt(filters.offset));
        }

        const [rows] = await pool.query(query, params);
        return rows;
    }

    static async count(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM tickets t WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND t.status = ?';
            params.push(filters.status);
        }
        if (filters.clientId) {
            query += ' AND t.client_id = ?';
            params.push(filters.clientId);
        }
        if (filters.agentId) {
            query += ' AND t.agent_id = ?';
            params.push(filters.agentId);
        }
        if (filters.from) {
            query += ' AND t.created_at >= ?';
            params.push(filters.from);
        }
        if (filters.to) {
            query += ' AND t.created_at <= ?';
            params.push(filters.to);
        }

        const [rows] = await pool.execute(query, params);
        return rows[0].count;
    }

    static async findByClientId(clientId) {
        const [rows] = await pool.execute(
            `SELECT * FROM tickets 
             WHERE client_id = ? 
             ORDER BY created_at DESC`,
            [clientId]
        );
        return rows;
    }

    static async countByAgentAndStatus(agentId, status) {
        const [rows] = await pool.execute(
            `SELECT COUNT(*) as count 
             FROM tickets 
             WHERE agent_id = ? AND status = ?`,
            [agentId, status]
        );
        return rows[0].count;
    }

    static async countByAgent(agentId) {
        const [rows] = await pool.execute(
            `SELECT COUNT(*) as count 
             FROM tickets 
             WHERE agent_id = ?`,
            [agentId]
        );
        return rows[0].count;
    }

    static async assignAgent(ticketId, agentId) {
        const [result] = await pool.execute(
            'UPDATE tickets SET agent_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [agentId, ticketId]
        );
        return result.affectedRows > 0;
    }

    static async updateStatus(ticketId, status, resolution = null) {
        const updates = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
        const params = [status];

        if (resolution !== null) {
            updates.push('resolution = ?');
            params.push(resolution);
        }

        params.push(ticketId);

        const [result] = await pool.execute(
            `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
            params
        );
        return result.affectedRows > 0;
    }

    static async update(ticketId, data) {
        const fields = [];
        const values = [];

        if (data.title) {
            fields.push('title = ?');
            values.push(data.title);
        }

        if (data.description) {
            fields.push('description = ?');
            values.push(data.description);
        }

        if (fields.length === 0) {
            return this.findById(ticketId);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(ticketId);

        const [result] = await pool.execute(
            `UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return this.findById(ticketId);
    }

    static async getAgentInProgressCount(agentId) {
        const [rows] = await pool.execute(
            `SELECT COUNT(*) as count 
             FROM tickets 
             WHERE agent_id = ? AND status = 'IN_PROGRESS'`,
            [agentId]
        );
        return rows[0].count;
    }

    static async validateStatusChange(oldStatus, newStatus, agentId, resolution) {
        const errors = [];

        // Regla 1: No se puede pasar de OPEN a RESOLVED directamente
        if (oldStatus === 'OPEN' && newStatus === 'RESOLVED') {
            errors.push('Cannot change status from OPEN to RESOLVED directly');
        }

        // Regla 2: Un ticket en RESOLVED no puede volver a abrirse
        if (oldStatus === 'RESOLVED' && newStatus !== 'RESOLVED') {
            errors.push('RESOLVED tickets cannot be reopened');
        }

        // Regla 3: Al pasar a IN_PROGRESS, debe tener agente asignado
        if (newStatus === 'IN_PROGRESS' && !agentId) {
            errors.push('Agent must be assigned when changing status to IN_PROGRESS');
        }

        // Regla 4: Al pasar a RESOLVED, debe tener resolución
        if (newStatus === 'RESOLVED' && (!resolution || resolution.trim().length === 0)) {
            errors.push('Resolution is required when resolving a ticket');
        }

        return errors;
    }
}

module.exports = Ticket;