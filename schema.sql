DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'receiver',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS rescues;
CREATE TABLE rescues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_name TEXT NOT NULL,
    food_type TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    pickup_deadline TEXT NOT NULL,
    location_name TEXT NOT NULL,
    address TEXT,
    lat REAL,
    lng REAL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
