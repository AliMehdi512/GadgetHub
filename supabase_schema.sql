-- Supabase SQL Schema for GadgetHub E-commerce Platform
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    image_url TEXT NOT NULL,
    images TEXT[], -- Array of image URLs
    stock_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0, -- Track sales
    is_digital BOOLEAN DEFAULT true,
    download_url TEXT,
    license_key TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_limited_edition BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- For unauthenticated users
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255), -- For unauthenticated users
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    shipping_address JSONB,
    billing_address JSONB,
    payment_intent_id VARCHAR(255), -- Stripe Payment Intent ID
    client_secret VARCHAR(255), -- Stripe Client Secret
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id) -- One review per user per product
);

-- Create sessions table for local auth
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Create functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'GH-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update product sales count
CREATE OR REPLACE FUNCTION update_product_sales()
RETURNS TRIGGER AS $$
BEGIN
    -- Update sales count when order status changes to 'delivered'
    IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
        UPDATE products 
        SET sales_count = sales_count + (
            SELECT SUM(oi.quantity) 
            FROM order_items oi 
            WHERE oi.order_id = NEW.id
        )
        WHERE id IN (
            SELECT product_id 
            FROM order_items 
            WHERE order_id = NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto sales increment
CREATE TRIGGER update_sales_on_delivery 
    AFTER UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_product_sales();

-- Insert sample admin user
INSERT INTO users (email, first_name, last_name, role) 
VALUES ('admin@gadgethub.com', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Electronics', 'electronics', 'Latest electronic gadgets and devices', 'https://images.unsplash.com/photo-1498049794561-7780c723c765?w=500&q=80'),
('Accessories', 'accessories', 'Tech accessories and peripherals', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'),
('Gaming', 'gaming', 'Gaming equipment and accessories', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=80'),
('Smart Home', 'smart-home', 'Smart home devices and automation', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'),
('Audio', 'audio', 'Audio equipment and headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products with online images
INSERT INTO products (name, slug, description, price, category_id, image_url, images, stock_count, is_digital, is_featured, is_limited_edition) 
SELECT 
    p.name,
    p.slug,
    p.description,
    p.price,
    c.id as category_id,
    p.image_url,
    p.images,
    p.stock_count,
    p.is_digital,
    p.is_featured,
    p.is_limited_edition
FROM (VALUES
    ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Latest iPhone with advanced camera system and A17 Pro chip', 1199.99, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'], 50, false, true, false),
    ('MacBook Pro M3', 'macbook-pro-m3', 'Powerful laptop with M3 chip for professionals', 1999.99, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'], 25, false, true, false),
    ('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Premium noise-canceling headphones', 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'], 100, false, true, false),
    ('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Flagship Android smartphone with S Pen', 1299.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'], 75, false, true, false),
    ('iPad Pro 12.9"', 'ipad-pro-12-9', 'Professional tablet with M2 chip', 1099.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'], 40, false, false, false),
    ('AirPods Pro 2nd Gen', 'airpods-pro-2nd-gen', 'Wireless earbuds with active noise cancellation', 249.99, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&q=80'], 200, false, false, false),
    ('Nintendo Switch OLED', 'nintendo-switch-oled', 'Gaming console with OLED display', 349.99, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=80'], 60, false, false, false),
    ('PlayStation 5', 'playstation-5', 'Next-gen gaming console', 499.99, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80'], 30, false, true, true),
    ('Apple Watch Series 9', 'apple-watch-series-9', 'Advanced smartwatch with health monitoring', 399.99, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=80'], 80, false, false, false),
    ('Dell XPS 13', 'dell-xps-13', 'Ultrabook with 13th gen Intel processor', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'], 35, false, false, false),
    ('Samsung 4K Monitor', 'samsung-4k-monitor', '32-inch 4K UHD monitor for professionals', 599.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'], 45, false, false, false),
    ('Logitech MX Master 3S', 'logitech-mx-master-3s', 'Wireless mouse for productivity', 99.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80'], 150, false, false, false),
    ('Mechanical Keyboard', 'mechanical-keyboard', 'RGB mechanical keyboard with Cherry MX switches', 149.99, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80'], 90, false, false, false),
    ('Webcam 4K', 'webcam-4k', 'Professional 4K webcam for streaming', 199.99, 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&q=80'], 70, false, false, false),
    ('Smart Speaker', 'smart-speaker', 'Voice-controlled smart speaker with AI assistant', 79.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'], 120, false, false, false)
) AS p(name, slug, description, price, image_url, images, stock_count, is_digital, is_featured, is_limited_edition)
JOIN categories c ON c.slug = CASE 
    WHEN p.name LIKE '%iPhone%' OR p.name LIKE '%MacBook%' OR p.name LIKE '%iPad%' OR p.name LIKE '%AirPods%' OR p.name LIKE '%Apple Watch%' THEN 'electronics'
    WHEN p.name LIKE '%Sony%' OR p.name LIKE '%Samsung%' OR p.name LIKE '%Dell%' THEN 'electronics'
    WHEN p.name LIKE '%Nintendo%' OR p.name LIKE '%PlayStation%' THEN 'gaming'
    WHEN p.name LIKE '%Keyboard%' OR p.name LIKE '%Mouse%' OR p.name LIKE '%Webcam%' THEN 'accessories'
    WHEN p.name LIKE '%Speaker%' THEN 'smart-home'
    ELSE 'electronics'
END
ON CONFLICT (slug) DO NOTHING;

-- Create view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
    (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered') as total_revenue,
    (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
    (SELECT COUNT(*) FROM orders WHERE status = 'processing') as processing_orders,
    (SELECT COUNT(*) FROM orders WHERE status = 'delivered') as delivered_orders;

-- Create view for product sales analytics
CREATE OR REPLACE VIEW product_sales_analytics AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.sales_count,
    p.stock_count,
    p.view_count,
    p.average_rating,
    p.review_count,
    c.name as category_name,
    COALESCE(SUM(oi.quantity), 0) as total_ordered,
    COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
WHERE p.is_active = true
GROUP BY p.id, p.name, p.slug, p.price, p.sales_count, p.stock_count, p.view_count, p.average_rating, p.review_count, c.name;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
