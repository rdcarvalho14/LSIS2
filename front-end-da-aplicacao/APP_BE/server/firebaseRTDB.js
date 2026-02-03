const admin = require('firebase-admin');

// Inicializar Firebase Admin com Realtime Database
let database;

const initializeFirebase = () => {
  try {
    if (admin.apps.length > 0) {
      database = admin.database();
      return database;
    }

    // Credenciais via variáveis de ambiente
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.europe-west1.firebasedatabase.app`
      });
      console.log('✅ Firebase Realtime Database inicializado');
    }
    // Ficheiro de credenciais local
    else {
      try {
        const serviceAccount = require('./firebase-credentials.json');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: `https://${serviceAccount.project_id}-default-rtdb.europe-west1.firebasedatabase.app`
        });
        console.log('✅ Firebase Realtime Database inicializado com ficheiro');
      } catch (fileError) {
        console.error('❌ Credenciais Firebase não encontradas!');
        throw new Error('Credenciais Firebase não configuradas');
      }
    }

    database = admin.database();
    return database;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error.message);
    throw error;
  }
};

try {
  initializeFirebase();
} catch (error) {
  console.error('Firebase não inicializado:', error.message);
}

module.exports = {
  database,
  admin,
  initializeFirebase
};
