const { db } = require('./firebase');
const { v4: uuidv4 } = require('uuid');

// Coleção de utilizadores
const USERS_COLLECTION = 'users';

// Criar utilizador
const createUser = async (nome, email, passwordHash, calculatorCode, telefone = null, morada = null) => {
  try {
    const userId = uuidv4();
    const userData = {
      id: userId,
      nome,
      email,
      password_hash: passwordHash,
      calculadora_code: calculatorCode || null,
      telefone: telefone || null,
      morada: morada || null,
      created_at: new Date().toISOString()
    };

    await db.collection(USERS_COLLECTION).doc(userId).set(userData);
    
    console.log('✅ Utilizador criado:', { id: userId, nome, email });
    
    return {
      id: userId,
      nome,
      email,
      calculadora_code: calculatorCode
    };
  } catch (err) {
    console.error('❌ Erro ao criar utilizador:', err.message);
    throw err;
  }
};

// Buscar utilizador por email
const getUserByEmail = async (email) => {
  try {
    const snapshot = await db.collection(USERS_COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data();
  } catch (err) {
    console.error('❌ Erro ao buscar utilizador por email:', err.message);
    throw err;
  }
};

// Buscar utilizador por username (nome)
const getUserByUsername = async (username) => {
  try {
    const snapshot = await db.collection(USERS_COLLECTION)
      .where('nome', '==', username)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data();
  } catch (err) {
    console.error('❌ Erro ao buscar utilizador por username:', err.message);
    throw err;
  }
};

// Atualizar código da calculadora
const updateCalculatorCode = async (userId, calculatorCode) => {
  try {
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    
    await userRef.update({
      calculadora_code: calculatorCode
    });

    const updatedDoc = await userRef.get();
    return updatedDoc.data();
  } catch (err) {
    console.error('❌ Erro ao atualizar código da calculadora:', err.message);
    throw err;
  }
};

// Obter todos os utilizadores
const getAllUsers = async () => {
  try {
    const snapshot = await db.collection(USERS_COLLECTION).get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        morada: data.morada,
        calculadora_code: data.calculadora_code,
        created_at: data.created_at
      };
    });
  } catch (err) {
    console.error('❌ Erro ao obter utilizadores:', err.message);
    throw err;
  }
};

// Função vazia para compatibilidade (Firestore não precisa criar tabelas)
const createUsersTable = async () => {
  console.log('✅ Firestore pronto - não precisa criar tabelas');
};

module.exports = {
  createUsersTable,
  createUser,
  getUserByEmail,
  getUserByUsername,
  updateCalculatorCode,
  getAllUsers
};
