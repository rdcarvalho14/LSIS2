const pool = require('./db');

// Criar tabela users (modelo UUID e nomes pedidos)
const createUsersTable = async () => {
  try {
    // Criar extensão primeiro (ignorar se já existe)
    try {
      await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    } catch (extErr) {
      // Extensão já existe, ignorar
    }
    
    // Criar tabela
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        password_hash VARCHAR NOT NULL,
        telefone VARCHAR,
        morada VARCHAR(255),
        calculadora_code VARCHAR(4),
        photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(query);
    
    // Adicionar coluna photo se não existir (para tabelas já criadas)
    try {
      await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS photo TEXT;');
    } catch (alterErr) {
      // Coluna já existe, ignorar
    }
    
    console.log('✅ Tabela users criada com sucesso');
  } catch (err) {
    console.error('❌ Erro ao criar tabela users:', err.message);
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
    console.error('Erro ao criar utilizador:', err.message);
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
  // Compat: procurar por nome igual ao username fornecido
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
  const query = 'SELECT id, nome, email, telefone, morada, calculadora_code, photo, created_at FROM users;';
  
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(' Erro ao obter utilizadores:', err.message);
    throw err;
  }
};

// Atualizar foto do utilizador
const updateUserPhoto = async (userId, photo) => {
  const query = `
    UPDATE users 
    SET photo = $1
    WHERE id = $2
    RETURNING id, nome, email, photo;
  `;
  
  try {
    const result = await pool.query(query, [photo, userId]);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Erro ao atualizar foto:', err.message);
    throw err;
  }
};

// Obter utilizador por ID
const getUserById = async (userId) => {
  const query = 'SELECT id, nome, email, telefone, morada, photo, created_at FROM users WHERE id = $1;';
  
  try {
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Erro ao buscar utilizador:', err.message);
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
  updateUserPhoto,
  getUserById,
  pool
};
