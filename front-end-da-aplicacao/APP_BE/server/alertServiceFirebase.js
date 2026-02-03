const { db } = require('./firebase');
const { v4: uuidv4 } = require('uuid');

// Coleções
const ALERTS_COLLECTION = 'alerts';
const DEVICES_COLLECTION = 'devices';
const POLICE_USERS_COLLECTION = 'police_users';
const ALERT_HISTORY_COLLECTION = 'alert_history';

// Criar alerta
const createAlert = async ({ user_id, device_id, origem, status, latitude, longitude }) => {
  try {
    const alertId = uuidv4();
    const alertData = {
      id: alertId,
      user_id,
      device_id: device_id || null,
      origem: origem || 'APP',
      status: status || 'EM PROCESSO',
      latitude,
      longitude,
      created_at: new Date().toISOString()
    };

    await db.collection(ALERTS_COLLECTION).doc(alertId).set(alertData);
    
    console.log('🚨 Alerta criado:', alertId);
    return alertData;
  } catch (err) {
    console.error('❌ Erro ao criar alerta:', err.message);
    throw err;
  }
};

// Obter alertas por utilizador
const getAlertsByUser = async (userId) => {
  try {
    const snapshot = await db.collection(ALERTS_COLLECTION)
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error('❌ Erro ao obter alertas:', err.message);
    throw err;
  }
};

// Obter todos os alertas
const getAllAlerts = async () => {
  try {
    const snapshot = await db.collection(ALERTS_COLLECTION)
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error('❌ Erro ao obter todos os alertas:', err.message);
    throw err;
  }
};

// Atualizar status do alerta
const updateAlertStatus = async (alertId, status) => {
  try {
    const alertRef = db.collection(ALERTS_COLLECTION).doc(alertId);
    
    await alertRef.update({
      status,
      updated_at: new Date().toISOString()
    });

    const updatedDoc = await alertRef.get();
    return updatedDoc.data();
  } catch (err) {
    console.error('❌ Erro ao atualizar status do alerta:', err.message);
    throw err;
  }
};

// Apagar alerta
const deleteAlert = async (alertId) => {
  try {
    const alertRef = db.collection(ALERTS_COLLECTION).doc(alertId);
    const doc = await alertRef.get();
    if (!doc.exists) return null;

    await alertRef.delete();
    return { id: alertId };
  } catch (err) {
    console.error('❌ Erro ao apagar alerta:', err.message);
    throw err;
  }
};

// Registar dispositivo
const registerDevice = async ({ serial_number, bluetooth_mac, user_id }) => {
  try {
    const deviceId = uuidv4();
    const deviceData = {
      id: deviceId,
      serial_number,
      bluetooth_mac: bluetooth_mac || null,
      user_id: user_id || null,
      ativo: false,
      created_at: new Date().toISOString()
    };

    await db.collection(DEVICES_COLLECTION).doc(deviceId).set(deviceData);
    
    console.log('📱 Dispositivo registado:', deviceId);
    return deviceData;
  } catch (err) {
    console.error('❌ Erro ao registar dispositivo:', err.message);
    throw err;
  }
};

// Função vazia para compatibilidade (Firestore não precisa criar tabelas)
const createAlertTables = async () => {
  console.log('✅ Firestore pronto - coleções de alertas disponíveis');
};

module.exports = {
  createAlertTables,
  createAlert,
  getAlertsByUser,
  getAllAlerts,
  updateAlertStatus,
  deleteAlert,
  registerDevice
};
