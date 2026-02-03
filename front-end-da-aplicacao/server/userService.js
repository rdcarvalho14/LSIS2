const pool = require('./db');

// Criar tabela users com UUID e colunas alinhadas
const createUsersTable = async () => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR NOT NULL,
      email VARCHAR UNIQUE NOT NULL,
      password_hash VARCHAR NOT NULL,
      telefone VARCHAR,
      morada VARCHAR(255),
      calculadora_code VARCHAR(4),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(query);
    console.log(' Tabela users criada com sucesso');
  } catch (err) {
    console.error(' Erro ao criar tabela users:', err);
  }
};

// Inserir novo utilizador
const createUser = async (nome, email, passwordHash, calculatorCode, telefone = null, morada = null) => {
  const query = `
    INSERT INTO users (nome, email, password_hash, calculadora_code, telefone, morada)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, nome, email, calculadora_code;
  `;
  
  try {
    const result = await pool.query(query, [nome, email, passwordHash, calculatorCode, telefone, morada]);
    console.log(' Utilizador criado:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error(' Erro ao criar utilizador:', err.message);
    throw err;
  }
};

// Buscar utilizador por email
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1;';
  
  try {
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (err) {
    console.error(' Erro ao buscar utilizador:', err.message);
    throw err;
  }
};

// Buscar utilizador por username
const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE nome = $1;';
  
  try {
    const result = await pool.query(query, [username]);
    return result.rows[0];
  } catch (err) {
    console.error(' Erro ao buscar utilizador:', err.message);
    throw err;
  }
};

// Atualizar código da calculadora
const updateCalculatorCode = async (userId, calculatorCode) => {
  const query = `
    UPDATE users 
    SET calculadora_code = $1
    WHERE id = $2
    RETURNING *;
  `;
  
  try {
    const result = await pool.query(query, [calculatorCode, userId]);
    return result.rows[0];
  } catch (err) {
    console.error(' Erro ao atualizar código da calculadora:', err.message);
    throw err;
  }
};

// Obter todos os utilizadores
const getAllUsers = async () => {
  const query = 'SELECT id, nome, email, calculadora_code, created_at FROM users;';
  
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Erro ao obter utilizadores:', err.message);
    throw err;
  }
};

module.exports = {
  createUsersTable,
  createUser,
  getUserByEmail,
  getUserByUsername,
  updateCalculatorCode,
  getAllUsers,
  pool
};
