const { Pool } = require('pg');

const connectionString =
  'postgres://harunhurtic:IxVcQPJNkTRRTu7jVaCPhEDF2SgldEUs@dpg-cg9h2nm4dad5p6qvu7ng-a.oregon-postgres.render.com/notilfy?ssl=true';

const pool = new Pool({ connectionString: connectionString });

pool.connect(function (err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
  console.log('Database Connected Successfully');

  const createUserTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(999),
    salt VARCHAR(999)
  );`;

  const createNotesTableQuery = `CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, 
    description VARCHAR(255),
    image VARCHAR(255),
    favourite BOOLEAN NOT NULL
 );`;

  pool.query(createUserTableQuery, (err, res) => {
    if (err) {
      console.error('error creating table1', err);
    } else if (res.rowCount === 0) {
      console.log('table1 already exists');
    } else {
      console.log('users table created successfully');
    }
  });

  pool.query(createNotesTableQuery, (err, res) => {
    if (err) {
      console.error('error creating table2', err);
    } else if (res.rowCount === 0) {
      console.log('table2 already exists');
    } else {
      console.log('notes table created successfully');
    }
  });
});

module.exports = pool;
