const pool = require('../config/database');

class Agent {
    static async create(agentData) {
        const [result] = await pool.execute(
            'INSERT INTO agents (name, email) VALUES (?, ?)',
            [agentData.name, agentData.email]
        );
        return this.findById(result.insertId);
    }

    static async findAll(limit = 10, offset = 0) {
        const [rows] = await pool.query(
            'SELECT * FROM agents ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT a.*, 
                    (SELECT COUNT(*) FROM tickets WHERE agent_id = a.id AND status = 'IN_PROGRESS') as tickets_in_progress,
                    (SELECT COUNT(*) FROM tickets WHERE agent_id = a.id AND status = 'RESOLVED') as tickets_resolved,
                    (SELECT COUNT(*) FROM tickets WHERE agent_id = a.id) as total_tickets
             FROM agents a 
             WHERE a.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM agents WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async count() {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM agents');
        return rows[0].count;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        if (data.name) {
            fields.push('name = ?');
            values.push(data.name);
        }

        if (data.email) {
            fields.push('email = ?');
            values.push(data.email);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const [result] = await pool.execute(
            `UPDATE agents SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );

        return this.findById(id);
    }

     static async delete(id) {
        const [rows] = await pool.execute(
            'DELETE FROM agents WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = Agent;