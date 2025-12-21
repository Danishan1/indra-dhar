CREATE TABLE cost_projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_uuid CHAR(36) NOT NULL UNIQUE,
    project_name VARCHAR(255) NOT NULL,
    total_cost JSON,
    profit_value DECIMAL(14, 2),
    profit_type ENUM('Fixed', 'Percentage'),
    project_gst DECIMAL(14, 2),
    product_type ENUM('Finished', 'Semi Finished', 'Raw Material') DEFAULT 'Finished',
    project_progress ENUM('Planned', 'Completed', 'In-Active', 'Active') DEFAULT 'Planned',
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);