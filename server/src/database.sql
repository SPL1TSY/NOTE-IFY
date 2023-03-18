CREATE DATABASE notes_db;

-- Create a table for users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE,
  password VARCHAR(999),
  salt VARCHAR(999)
);

--Create a table for notes
CREATE TABLE IF NOT EXISTS notes (
   id SERIAL PRIMARY KEY, 
   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, 
   description VARCHAR(255),
   image VARCHAR(255),
   favourite BOOLEAN NOT NULL
);

