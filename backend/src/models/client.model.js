const pool = require('../config/database');

class Client {
    static async create(clientData) {
        const [result] = await pool.execute(
            'INSERT INTO clients (name, email) VALUES (?, ?)',
            [clientData.name, clientData.email]
        );
        return this.findById(result.insertId);
    }

    static async findAll(limit = 10, offset = 0) {
        // Convertir a números enteros
        const limitInt = parseInt(limit);
        const offsetInt = parseInt(offset);
        
        const [rows] = await pool.query(
            'SELECT * FROM clients ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limitInt, offsetInt]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM clients WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM clients WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async count() {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM clients');
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

        values.push(parseInt(id));
        const [result] = await pool.execute(
            `UPDATE clients SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );

        return this.findById(id);
    }

    static async delete(id) {
        const [rows] = await pool.execute(
            'DELETE FROM clients WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = Client;