DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'receiver', -- 'provider' (school) or 'receiver'
  name TEXT,
  avatar TEXT,
  phone TEXT,
  organization TEXT,
  city TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  points INTEGER DEFAULT 0, -- Used for Top Volunteer/School Leaderboards
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS food_listings;
CREATE TABLE food_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  title TEXT NOT NULL,           -- "Food Type" e.g. Nasi Kuning
  description TEXT,              -- "Additional Instructions"
  category TEXT NOT NULL,        -- "Intended Use" (consumption/farm)
  quantity_portions INTEGER,     -- From "Quantity (Portions)" input
  quantity_kg REAL,              -- For graphs (can be calculated or tracked behind the scenes)
  pickup_time TEXT NOT NULL,     -- "Pickup Deadline"
  location TEXT,                 -- "Pickup Point (Specific Area)" e.g. Canteen
  address TEXT,                  -- "Full Street Address (Auto-filled)"
  latitude REAL,
  longitude REAL,
  status TEXT DEFAULT 'available', -- 'available', 'claimed', 'picked_up'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(provider_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS claims;
CREATE TABLE claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'completed'
  claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(listing_id) REFERENCES food_listings(id),
  FOREIGN KEY(receiver_id) REFERENCES users(id)
);
