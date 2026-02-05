-- Script de configuración inicial
DROP DATABASE IF EXISTS support_tickets;
CREATE DATABASE support_tickets;
USE support_tickets;

-- Tabla clients
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla agents
CREATE TABLE agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla tickets
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    agent_id INT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    resolution TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agregar foreign keys
ALTER TABLE tickets ADD FOREIGN KEY (client_id) REFERENCES clients(id);
ALTER TABLE tickets ADD FOREIGN KEY (agent_id) REFERENCES agents(id);

-- Datos de ejemplo
INSERT INTO clients (name, email) VALUES
('Cliente Uno', 'cliente1@example.com'),
('Cliente Dos', 'cliente2@example.com'),
('Cliente Tres', 'cliente3@example.com');

INSERT INTO agents (name, email) VALUES
('Agente Uno', 'agente1@example.com'),
('Agente Dos', 'agente2@example.com'),
('Agente Tres', 'agente3@example.com');

-- Tickets de ejemplo
INSERT INTO tickets (client_id, agent_id, title, description, status) VALUES
(1, 1, 'Problema con login', 'No puedo iniciar sesión en la plataforma', 'OPEN'),
(2, 2, 'Error en factura', 'La factura tiene un monto incorrecto', 'IN_PROGRESS'),
(3, 3, 'Solicitud de función', 'Necesito exportar reportes a PDF', 'RESOLVED');

-- Mostrar datos insertados
SELECT '=== CLIENTES ===' as '';
SELECT * FROM clients;

SELECT '=== AGENTES ===' as '';
SELECT * FROM agents;

SELECT '=== TICKETS ===' as '';
SELECT * FROM tickets;