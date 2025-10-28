CREATE TABLE cost_allocations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    allocation_basis ENUM('machine_hours','labor_hours','units_produced','revenue_share','custom_formula') NOT NULL,
    allocation_percentage DECIMAL(5,2) DEFAULT 100.00,  -- percent of cost to allocate
    formula_expression TEXT NULL,                      -- optional JS-like formula (future support)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES cost_categories(id)
);
