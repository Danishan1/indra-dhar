CREATE TABLE batches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    batch_name VARCHAR(255) NOT NULL,
    produced_units DECIMAL(12,2) NOT NULL,
    created_by BIGINT UNSIGNED,
    started_at DATETIME,
    completed_at DATETIME,
    status ENUM('draft','calculated','approved','archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
