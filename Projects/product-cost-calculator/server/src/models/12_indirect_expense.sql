CREATE TABLE indirect_expense (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    indirect_expense_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type ENUM('fixed', 'percentage') NOT NULL,
    value DECIMAL(12, 4) NOT NULL,
    frequency ENUM(
        'Monthly',
        'Yearly',
        'Per Hour'
    ),
    is_global BOOLEAN DEFAULT FALSE,
    -- if true, applies to all batches
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);