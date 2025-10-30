CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    default_batch_size DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE raw_materials (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    material_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,               -- e.g. kg, liter, piece
    unit_price DECIMAL(12,4) NOT NULL,
    stock_quantity DECIMAL(12,4) DEFAULT 0,
    reorder_level DECIMAL(12,4) DEFAULT 0,
    vendor_id BIGINT UNSIGNED,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE labors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    labor_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type ENUM('direct', 'indirect') NOT NULL,
    rate_per_hour DECIMAL(10,2) NOT NULL,
    overtime_rate DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE machines (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    machine_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    cost_per_hour DECIMAL(10,2) NOT NULL,
    maintenance_cost DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE overheads (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    overhead_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type ENUM('fixed', 'percentage') NOT NULL,
    value DECIMAL(12,4) NOT NULL,
    frequency ENUM('monthly', 'annual', 'per_batch') DEFAULT 'per_batch',
    is_global BOOLEAN DEFAULT FALSE,  -- if true, applies to all batches
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE utilities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utility_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,          -- e.g. kWh, liter
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE batches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_uuid CHAR(36) NOT NULL UNIQUE,
    product_id BIGINT UNSIGNED NOT NULL,
    batch_size DECIMAL(12,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    status ENUM('draft', 'in_progress', 'completed') DEFAULT 'draft',
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE batch_raw_materials (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    material_id BIGINT UNSIGNED NOT NULL,
    quantity_used DECIMAL(12,4) NOT NULL,
    unit_price DECIMAL(12,4) NOT NULL,
    wastage_percent DECIMAL(5,2) DEFAULT 0.00,
    scrap_value DECIMAL(12,4) DEFAULT 0.00,
    total_cost DECIMAL(14,4),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (material_id) REFERENCES raw_materials(id)
);

CREATE TABLE batch_labors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    labor_id BIGINT UNSIGNED NOT NULL,
    hours_worked DECIMAL(10,2) NOT NULL,
    overtime_hours DECIMAL(10,2) DEFAULT 0.00,
    total_cost DECIMAL(12,4),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (labor_id) REFERENCES labors(id)
);

CREATE TABLE batch_machines (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    machine_id BIGINT UNSIGNED NOT NULL,
    hours_used DECIMAL(10,2) NOT NULL,
    cost_per_hour DECIMAL(10,2) NOT NULL,
    maintenance_cost DECIMAL(10,2) DEFAULT 0.00,
    total_cost DECIMAL(12,4),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (machine_id) REFERENCES machines(id)
);

CREATE TABLE batch_utilities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    utility_id BIGINT UNSIGNED NOT NULL,
    units_consumed DECIMAL(12,4) NOT NULL,
    unit_cost DECIMAL(12,4) NOT NULL,
    total_cost DECIMAL(12,4) ,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (utility_id) REFERENCES utilities(id)
);

CREATE TABLE batch_overheads (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    overhead_id BIGINT UNSIGNED NOT NULL,
    applied_value DECIMAL(12,4) NOT NULL,
    total_cost DECIMAL(12,4) NOT NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (overhead_id) REFERENCES overheads(id)
);

CREATE TABLE batch_packaging_transport (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    packaging_cost DECIMAL(12,4) DEFAULT 0.00,
    transportation_cost DECIMAL(12,4) DEFAULT 0.00,
    total_cost DECIMAL(12,4),
    FOREIGN KEY (batch_id) REFERENCES batches(id)
);

CREATE TABLE batch_profit (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    profit_type ENUM('percentage', 'fixed') NOT NULL,
    profit_value DECIMAL(12,4) NOT NULL,
    total_batch_cost DECIMAL(14,4) NOT NULL,
    total_selling_price DECIMAL(14,4),
    unit_cost DECIMAL(12,4),
    unit_selling_price DECIMAL(12,4),
    FOREIGN KEY (batch_id) REFERENCES batches(id)
);
