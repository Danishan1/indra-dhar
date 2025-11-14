CREATE TABLE cost_project_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    resource_type VARCHAR(255) NOT NULL,
    -- '/machines', '/raw-material', etc.
    resource_id BIGINT UNSIGNED NOT NULL,
    resource_name VARCHAR(255),
    data JSON NOT NULL,
    -- full dynamic attributes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES cost_projects(id) ON DELETE CASCADE
);