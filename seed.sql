-- Seed Providers (Schools)
INSERT INTO users (id, email, password, role, name, organization, points) VALUES 
(1, 'admin@sdn01.edu', 'password123', 'provider', 'Bapak Budi', 'SDN 01 Menteng', 0),
(2, 'admin@smpn12.edu', 'password123', 'provider', 'Ibu Ratna', 'SMPN 12 Jakarta', 0),
(3, 'admin@smkn57.edu', 'password123', 'provider', 'Pak Yanto', 'SMKN 57 Jakarta', 0);

-- Seed Receivers (Volunteers)
INSERT INTO users (id, email, password, role, name, points) VALUES 
(4, 'volunteer1@mbg.org', 'password123', 'receiver', 'Andi Pratama', 450),
(5, 'volunteer2@mbg.org', 'password123', 'receiver', 'Siti Nurbaya', 320),
(6, 'volunteer3@mbg.org', 'password123', 'receiver', 'Dewi Lestari', 150);

-- Seed Historical Food Listings (Past 7 Days)
-- SQLite doesn't have an easy DATE() minus days built-in for multi-row insertion without a CTE, so using hardcoded recent dates (assuming demo is around current date)
-- We will use relative dates using datetime('now', '-X days')

INSERT INTO food_listings (provider_id, title, category, quantity_portions, quantity_kg, pickup_time, status, created_at) VALUES 
(1, 'Nasi Kuning Sisa', 'consumption', 45, 12.5, '14:00', 'completed', datetime('now', '-6 days')),
(2, 'Sayur Lodeh', 'consumption', 30, 8.0, '15:00', 'completed', datetime('now', '-5 days')),
(3, 'Sayur Lodeh', 'farm', 20, 5.0, '15:00', 'completed', datetime('now', '-5 days')),
(1, 'Ayam Goreng', 'consumption', 50, 15.0, '13:30', 'completed', datetime('now', '-4 days')),
(2, 'Nasi Uduk', 'consumption', 25, 7.5, '14:30', 'completed', datetime('now', '-3 days')),
(3, 'Sayur Asem (Basi)', 'farm', 40, 10.0, '16:00', 'completed', datetime('now', '-2 days')),
(1, 'Telur Balado', 'consumption', 60, 18.0, '13:00', 'completed', datetime('now', '-1 days')),
(2, 'Nasi Putih Sisa', 'farm', 35, 9.5, '15:30', 'completed', datetime('now', '-1 days')),
(3, 'Rendang Ayam', 'consumption', 15, 4.0, '14:00', 'available', datetime('now')),
(1, 'Mie Goreng', 'consumption', 20, 6.0, '15:00', 'available', datetime('now'));

-- Seed Claims
INSERT INTO claims (listing_id, receiver_id, status) VALUES 
(1, 4, 'completed'),
(2, 5, 'completed'),
(3, 6, 'completed'),
(4, 4, 'completed'),
(5, 5, 'completed'),
(6, 6, 'completed'),
(7, 4, 'completed'),
(8, 5, 'completed');
