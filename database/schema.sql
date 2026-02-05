-- 1. Crear base de datos
CREATE DATABASE IF NOT EXISTS support_tickets;
USE support_tickets;

-- 2. Crear tabla clients
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Crear tabla agents
CREATE TABLE agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Crear tabla tickets
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    agent_id INT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') DEFAULT 'OPEN',
    resolution TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Agregar foreign keys (sin ON DELETE CASCADE para simplificar)
ALTER TABLE tickets 
ADD FOREIGN KEY (client_id) REFERENCES clients(id);

ALTER TABLE tickets 
ADD FOREIGN KEY (agent_id) REFERENCES agents(id);

-- 6. Índices básicos para mejorar rendimiento
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_client ON tickets(client_id);
CREATE INDEX idx_tickets_agent ON tickets(agent_id);
CREATE INDEX idx_tickets_created ON tickets(created_at);

-- 7. Insertar datos de ejemplo (opcional)
INSERT INTO clients (name, email) VALUES
('Juan Pérez', 'juan@example.com'),
('María García', 'maria@example.com'),
('Carlos López', 'carlos@example.com');

INSERT INTO agents (name, email) VALUES
('Ana Rodríguez', 'ana@example.com'),
('Pedro Martínez', 'pedro@example.com'),
('Laura Sánchez', 'laura@example.com');