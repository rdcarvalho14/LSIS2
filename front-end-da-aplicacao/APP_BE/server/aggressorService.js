const pool = require('./db');

// Criar tabela aggressors
const createAggressorsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS aggressors (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255),
        phone VARCHAR(50),
        car_plate VARCHAR(20),
        description TEXT,
        photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
    `;
    
    await pool.query(query);
    console.log('✅ Tabela aggressors criada com sucesso');
  } catch (err) {
    console.error('❌ Erro ao criar tabela aggressors:', err.message);
  }
};

// Guardar ou atualizar informações do agressor
const saveAggressor = async (userId, data) => {
  const { name, phone, carPlate, description, photo } = data;
  
  const query = `
    INSERT INTO aggressors (user_id, name, phone, car_plate, description, photo, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id)
    DO UPDATE SET
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      car_plate = EXCLUDED.car_plate,
      description = EXCLUDED.description,
      photo = EXCLUDED.photo,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  
  try {
    const result = await pool.query(query, [userId, name || null, phone || null, carPlate || null, description || null, photo || null]);
    console.log('✅ Informações do agressor guardadas para user:', userId);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Erro ao guardar agressor:', err.message);
    throw err;
  }
};

// Obter informações do agressor por user_id
const getAggressorByUserId = async (userId) => {
  const query = 'SELECT * FROM aggressors WHERE user_id = $1;';
  
  try {
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('❌ Erro ao buscar agressor:', err.message);
    throw err;
  }
};

// Apagar informações do agressor
const deleteAggressor = async (userId) => {
  const query = 'DELETE FROM aggressors WHERE user_id = $1 RETURNING *;';
  
  try {
    const result = await pool.query(query, [userId]);
    if (result.rows.length > 0) {
      console.log('✅ Informações do agressor apagadas para user:', userId);
      return true;
    }
    return false;
  } catch (err) {
    console.error('❌ Erro ao apagar agressor:', err.message);
    throw err;
  }
};

module.exports = {
  createAggressorsTable,
  saveAggressor,
  getAggressorByUserId,
  deleteAggressor
};
