const pool = require('./db');

// Cria todas as tabelas ligadas a alertas
const createAlertTables = async () => {
  try {
    // Criar tabela devices
    await pool.query(`
      CREATE TABLE IF NOT EXISTS devices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        serial_number VARCHAR UNIQUE NOT NULL,
        bluetooth_mac VARCHAR,
        user_id UUID REFERENCES users(id),
        ativo BOOLEAN DEFAULT false
      );
    `);

    // Criar tabela alerts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        device_id UUID REFERENCES devices(id),
        origem VARCHAR,
        status VARCHAR,
        latitude DECIMAL,
        longitude DECIMAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Criar tabela police_users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS police_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        password_hash VARCHAR NOT NULL
      );
    `);

    // Criar tabela alert_history
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alert_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        alert_id UUID REFERENCES alerts(id) NOT NULL,
        police_user_id UUID REFERENCES police_users(id),
        acao VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabelas de alertas criadas/verificadas');
  } catch (err) {
    console.error('❌ Erro ao criar tabelas de alertas:', err.message);
  }
};

const createAlert = async ({ user_id, device_id, origem, status, latitude, longitude }) => {
  const query = `
    INSERT INTO alerts (user_id, device_id, origem, status, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [user_id, device_id, origem, status, latitude, longitude];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao inserir alerta:', err.message);
    throw err;
  }
};

const getAllAlerts = async () => {
  const query = `
    SELECT 
      a.id,
      a.user_id,
      a.device_id,
      a.origem,
      a.status,
      a.latitude,
      a.longitude,
      a.created_at,
      u.nome as user_name,
      u.email as user_email,
      u.telefone as user_phone
    FROM alerts a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC;
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Erro ao buscar alertas:', err.message);
    throw err;
  }
};

const updateAlertStatus = async (alertId, status) => {
  const query = `
    UPDATE alerts 
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [status, alertId]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao atualizar status do alerta:', err.message);
    throw err;
  }
};

const deleteAlert = async (alertId) => {
  const deleteHistoryQuery = `
    DELETE FROM alert_history
    WHERE alert_id = $1;
  `;

  const deleteAlertQuery = `
    DELETE FROM alerts
    WHERE id = $1
    RETURNING *;
  `;

  try {
    await pool.query(deleteHistoryQuery, [alertId]);
    const result = await pool.query(deleteAlertQuery, [alertId]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Erro ao apagar alerta:', err.message);
    throw err;
  }
};

const addAlertHistory = async ({ alert_id, police_user_id, acao }) => {
  const query = `
    INSERT INTO alert_history (alert_id, police_user_id, acao)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [alert_id, police_user_id, acao]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao adicionar historico:', err.message);
    throw err;
  }
};

// Atualizar localização do alerta (para tracking em tempo real)
const updateAlertLocation = async (alertId, latitude, longitude) => {
  const query = `
    UPDATE alerts 
    SET latitude = $1, longitude = $2
    WHERE id = $3
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [latitude, longitude, alertId]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao atualizar localizacao do alerta:', err.message);
    throw err;
  }
};

module.exports = {
  createAlertTables,
  createAlert,
  getAllAlerts,
  updateAlertStatus,
  deleteAlert,
  addAlertHistory,
  updateAlertLocation
};
