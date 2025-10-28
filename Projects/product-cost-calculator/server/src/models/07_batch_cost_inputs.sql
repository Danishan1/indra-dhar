CREATE TABLE batch_cost_inputs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    cost_item_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(12,2) DEFAULT 0.00,
    rate DECIMAL(12,2) DEFAULT 0.00,
    total_cost DECIMAL(12,2) GENERATED ALWAYS AS (quantity * rate) STORED,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (cost_item_id) REFERENCES cost_items(id)
);
