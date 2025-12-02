-- Criação do banco de dados Merenda+
-- Sistema de gestão escolar para redução de desperdício de merenda

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS merenda_plus 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE merenda_plus;

-- Tabela de usuários
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    type ENUM('admin', 'merendeira') NOT NULL DEFAULT 'merendeira',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- Tabela de categorias de itens
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de itens do estoque
CREATE TABLE inventory_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'unidade',
    expiry_date DATE NOT NULL,
    purchase_date DATE,
    supplier VARCHAR(255),
    cost_per_unit DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    status ENUM('available', 'expired', 'consumed') NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_name (name)
);

-- Tabela de motivos de desperdício
CREATE TABLE waste_reasons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reason VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de registros de desperdício
CREATE TABLE waste_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventory_item_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL, -- Denormalizado para histórico
    quantity INT NOT NULL,
    reason_id INT NOT NULL,
    custom_reason TEXT, -- Para motivos personalizados
    waste_date DATE NOT NULL,
    registered_by INT NOT NULL,
    notes TEXT,
    estimated_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT,
    FOREIGN KEY (reason_id) REFERENCES waste_reasons(id) ON DELETE RESTRICT,
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_waste_date (waste_date),
    INDEX idx_registered_by (registered_by),
    INDEX idx_reason (reason_id),
    INDEX idx_item (inventory_item_id)
);

-- Tabela de configurações do sistema
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de logs de atividades
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Tabela de relatórios salvos
CREATE TABLE saved_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type ENUM('waste_summary', 'inventory_status', 'user_activity', 'custom') NOT NULL,
    filters JSON,
    created_by INT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_report_type (report_type)
);
