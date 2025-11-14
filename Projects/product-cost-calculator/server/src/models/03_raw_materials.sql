CREATE TABLE raw_materials (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    material_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,
    -- e.g. kg, liter, piece
    unit_price DECIMAL(12, 4) NOT NULL,
    stock_quantity DECIMAL(12, 4) DEFAULT 0,
    reorder_level DECIMAL(12, 4) DEFAULT 0,
    vendor_id BIGINT UNSIGNED,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);