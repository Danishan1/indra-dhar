CREATE TABLE batch_cost_results (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    total_direct_cost DECIMAL(14,2) DEFAULT 0.00,
    total_indirect_cost DECIMAL(14,2) DEFAULT 0.00,
    total_batch_cost DECIMAL(14,2) DEFAULT 0.00,
    cost_per_unit DECIMAL(12,4) DEFAULT 0.00,
    profit_margin DECIMAL(5,2) DEFAULT 0.00,
    suggested_selling_price DECIMAL(12,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id)
);
