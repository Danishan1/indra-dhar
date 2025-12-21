CREATE TABLE labors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    labor_uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    labor_type ENUM('Per Hour', 'Per Process', 'Salary') NOT NULL,
    rate_per_hour DECIMAL(10, 2) NOT NULL,
    overtime_rate DECIMAL(10, 2) DEFAULT 0.00,
    remark text,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);