CREATE DATABASE IF NOT EXISTS adminToko_db;
USE adminToko_db;

-- Tabel Produk
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL
);

-- Tabel Stock Produk
CREATE TABLE IF NOT EXISTS stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  current_stock INT NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabel Pembelian
CREATE TABLE IF NOT EXISTS purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  purchase_date DATETIME NOT NULL DEFAULT NOW()
);

-- Seed 10 produk
INSERT INTO products (product_name, unit_price) VALUES
('Beras 5kg', 75000),
('Gula 1kg', 15000),
('Minyak Goreng 1L', 20000),
('Telur 1kg', 28000),
('Tepung Terigu 1kg', 12000),
('Susu UHT 1L', 18000),
('Kopi Bubuk 200g', 25000),
('Teh Celup 25 pcs', 12000),
('Mie Instan', 3500),
('Sabun Mandi', 6000);

-- Seed stok produk
INSERT INTO stock (product_id, current_stock) VALUES
(1, 50), (2, 100), (3, 80), (4, 60), (5, 70),
(6, 40), (7, 30), (8, 90), (9, 200), (10, 120);
