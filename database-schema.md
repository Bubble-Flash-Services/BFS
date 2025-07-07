# Bubble Flash - Database Schema Documentation

## Overview
This document outlines the complete database schema for the Bubble Flash services application including car wash, bike wash, and laundry services.

## Database Schema Design

### 1. Users Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    profile_image VARCHAR(500),
    google_id VARCHAR(255) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Addresses Table
```sql
CREATE TABLE addresses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('home', 'work', 'other') DEFAULT 'home',
    full_address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    landmark VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Service Categories Table
```sql
CREATE TABLE service_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Service Subcategories Table
```sql
CREATE TABLE service_subcategories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_slug (category_id, slug)
);
```

### 5. Service Packages Table
```sql
CREATE TABLE service_packages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subcategory_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    monthly_price DECIMAL(10, 2),
    image_url VARCHAR(500),
    features JSON, -- Array of features
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subcategory_id) REFERENCES service_subcategories(id) ON DELETE CASCADE
);
```

### 6. Service Addons Table
```sql
CREATE TABLE service_addons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE
);
```

### 7. Laundry Items Table
```sql
CREATE TABLE laundry_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subcategory_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subcategory_id) REFERENCES service_subcategories(id) ON DELETE CASCADE
);
```

### 8. Accessories Table
```sql
CREATE TABLE accessories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    image_url VARCHAR(500),
    category ENUM('car', 'bike', 'laundry') NOT NULL,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 9. Orders Table
```sql
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    pickup_date DATE,
    pickup_time TIME,
    delivery_date DATE,
    delivery_time TIME,
    address_id VARCHAR(36),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL
);
```

### 10. Order Items Table
```sql
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    item_type ENUM('package', 'addon', 'accessory', 'laundry_item') NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    metadata JSON, -- Store additional item details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### 11. Shopping Cart Table
```sql
CREATE TABLE shopping_cart (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    session_id VARCHAR(255), -- For guest users
    item_type ENUM('package', 'addon', 'accessory', 'laundry_item') NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    metadata JSON, -- Store additional item details (addons, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 12. Coupons Table
```sql
CREATE TABLE coupons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 13. User Coupons Table
```sql
CREATE TABLE user_coupons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    coupon_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(36),
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
```

### 14. Order Status History Table
```sql
CREATE TABLE order_status_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### 15. Notifications Table
```sql
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'promotion', 'system') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    data JSON, -- Additional notification data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 16. Contact Requests Table
```sql
CREATE TABLE contact_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    message TEXT NOT NULL,
    status ENUM('new', 'in_progress', 'resolved') DEFAULT 'new',
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 17. FAQ Table
```sql
CREATE TABLE faqs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 18. Admin Users Table
```sql
CREATE TABLE admin_users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'manager') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Indexes for Performance

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);

-- Address indexes
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default);

-- Service indexes
CREATE INDEX idx_service_subcategories_category ON service_subcategories(category_id);
CREATE INDEX idx_service_packages_subcategory ON service_packages(subcategory_id);
CREATE INDEX idx_service_addons_category ON service_addons(category_id);
CREATE INDEX idx_laundry_items_subcategory ON laundry_items(subcategory_id);

-- Order indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(pickup_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Cart indexes
CREATE INDEX idx_cart_user_id ON shopping_cart(user_id);
CREATE INDEX idx_cart_session_id ON shopping_cart(session_id);

-- Coupon indexes
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_user_coupons_user_id ON user_coupons(user_id);
```

## Sample Data Insertion

```sql
-- Insert service categories
INSERT INTO service_categories (id, name, slug, description, image_url) VALUES
('cat-1', 'Car Wash', 'car-wash', 'Professional car cleaning services', '/car/home.png'),
('cat-2', 'Bike Wash', 'bike-wash', 'Professional bike cleaning services', '/bike/home.png'),
('cat-3', 'Laundry Service', 'laundry', 'Complete laundry and dry cleaning services', '/laundry/home.png');

-- Insert car wash subcategories
INSERT INTO service_subcategories (id, category_id, name, slug, description, image_url) VALUES
('subcat-1', 'cat-1', 'Hatchbacks', 'hatchbacks', 'Car wash for hatchback vehicles', '/car/car1.png'),
('subcat-2', 'cat-1', 'SUV', 'suv', 'Car wash for SUV vehicles', '/car/car2.png'),
('subcat-3', 'cat-1', 'Sedans & Luxuries', 'sedans-luxuries', 'Car wash for sedans and luxury vehicles', '/car/car3.png');

-- Insert bike wash subcategories
INSERT INTO service_subcategories (id, category_id, name, slug, description, image_url) VALUES
('subcat-4', 'cat-2', 'Commuter Bikes', 'commuter', 'Bike wash for commuter bikes', '/bike/bike1.png'),
('subcat-5', 'cat-2', 'Sports Bikes', 'sports', 'Bike wash for sports bikes', '/bike/bike2.png'),
('subcat-6', 'cat-2', 'Cruiser Bikes', 'cruiser', 'Bike wash for cruiser bikes', '/bike/bike3.png');

-- Insert laundry subcategories
INSERT INTO service_subcategories (id, category_id, name, slug, description, image_url) VALUES
('subcat-7', 'cat-3', 'Dry Cleaning', 'dry-cleaning', 'Professional dry cleaning services', '/laundry/laundry1.png'),
('subcat-8', 'cat-3', 'Wash & Fold', 'wash-fold', 'Regular washing and folding services', '/laundry/laundry2.png'),
('subcat-9', 'cat-3', 'Ironing & Pressing', 'ironing', 'Professional ironing and pressing services', '/laundry/laundry3.png');
```

This schema provides a robust foundation for your Bubble Flash application with proper relationships, indexing, and scalability considerations.
