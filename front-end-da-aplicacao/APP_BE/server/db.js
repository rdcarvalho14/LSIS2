const { Pool } = require('pg');

// Suporta connection string direta ou variáveis individuais
const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false }, // Necessário para Supabase/cloud
        max: 10, // máximo de conexões no pool
        idleTimeoutMillis: 30000, // timeout de inatividade
        connectionTimeoutMillis: 5000 // timeout de ligação
      }
    : {
        user: process.env.PGUSER || 'connect4',
        password: process.env.PGPASSWORD || 'admin1234',
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.PGDATABASE || 'Connec4DB_APP',
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      }
);

pool.on('error', (err) => {
  console.error('Pool error (a reconectar):', err.message);
});

pool.on('connect', () => {
  console.log(' Conexão à base de dados estabelecida');
});

module.exports = pool;
