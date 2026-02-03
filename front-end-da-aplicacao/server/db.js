const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'connect4',
  password: process.env.PGPASSWORD || 'admin1234',
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'Connec4DB_APP',
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
