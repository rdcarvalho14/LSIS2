const pool = require('./db');

// Criar utilizador polícia
const createPoliceUser = async (nome, email, passwordHash) => {
  const query = `
    INSERT INTO police_users (nome, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, nome, email;
  `;
  
  try {
    const result = await pool.query(query, [nome, email, passwordHash]);
    console.log('✅ Utilizador polícia criado:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Erro ao criar utilizador polícia:', err.message);
    throw err;
  }
};

// Buscar utilizador polícia por email
const getPoliceUserByEmail = async (email) => {
  const query = 'SELECT * FROM police_users WHERE email = $1;';
  
  try {
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Erro ao buscar utilizador polícia:', err.message);
    throw err;
  }
};

// Obter todos os utilizadores polícia
const getAllPoliceUsers = async () => {
  const query = 'SELECT id, nome, email FROM police_users;';
  
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('❌ Erro ao obter utilizadores polícia:', err.message);
    throw err;
  }
};

module.exports = {
  createPoliceUser,
  getPoliceUserByEmail,
  getAllPoliceUsers
};
