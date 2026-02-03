const admin = require('firebase-admin');

// Inicializar Firebase Admin
// OPÇÃO 1: Usando variáveis de ambiente (recomendado para produção)
// OPÇÃO 2: Usando ficheiro JSON de credenciais

let db;

const initializeFirebase = () => {
  try {
    // Se já está inicializado, retorna
    if (admin.apps.length > 0) {
      db = admin.firestore();
      return db;
    }

    // OPÇÃO 1: Credenciais via variáveis de ambiente
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // A private key vem com \n escapados, precisamos converter
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
      console.log('✅ Firebase inicializado com variáveis de ambiente');
    }
    // OPÇÃO 2: Ficheiro de credenciais local
    else {
      try {
        const serviceAccount = require('./firebase-credentials.json');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase inicializado com ficheiro de credenciais');
      } catch (fileError) {
        console.error('❌ Erro: Credenciais Firebase não encontradas!');
        console.log('📋 Configure uma das opções:');
        console.log('   1. Crie o ficheiro firebase-credentials.json');
        console.log('   2. Configure as variáveis de ambiente:');
        console.log('      - FIREBASE_PROJECT_ID');
        console.log('      - FIREBASE_CLIENT_EMAIL');
        console.log('      - FIREBASE_PRIVATE_KEY');
        throw new Error('Credenciais Firebase não configuradas');
      }
    }

    db = admin.firestore();
    
    // Configurações do Firestore
    db.settings({
      ignoreUndefinedProperties: true
    });

    return db;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error.message);
    throw error;
  }
};

// Inicializar ao carregar o módulo
try {
  initializeFirebase();
} catch (error) {
  console.error('Firebase não inicializado:', error.message);
}

// Exportar a instância do Firestore
module.exports = {
  db,
  admin,
  initializeFirebase
};
