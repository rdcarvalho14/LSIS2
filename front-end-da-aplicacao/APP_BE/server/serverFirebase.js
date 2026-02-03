require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// ========================================
// ESCOLHER BACKEND: 'firebase' ou 'postgres'
// ========================================
const BACKEND = process.env.DATABASE_BACKEND || 'firebase';

let userService, alertService;

if (BACKEND === 'firebase') {
  console.log('🔥 Usando Firebase como backend');
  userService = require('./userServiceFirebase');
  alertService = require('./alertServiceFirebase');
} else {
  console.log('🐘 Usando PostgreSQL como backend');
  userService = require('./userService');
  alertService = require('./alertService');
}

const app = express();
app.use(express.json());
app.use(cors());

// Inicializar (no Firebase não faz nada, no Postgres cria tabelas)
userService.createUsersTable();
alertService.createAlertTables();

// ========================================
// ROTAS DE AUTENTICAÇÃO
// ========================================

// Registar novo utilizador
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, calculator_code, telefone, morada } = req.body;

    console.log('📝 Registo recebido:', { username, email, calculator_code });

    // Validações
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email e password são obrigatórios.' });
    }

    // Verificar se utilizador já existe
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email já registado.' });
    }

    const existingUsername = await userService.getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username já existe.' });
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar utilizador com código da calculadora 
    const newUser = await userService.createUser(
      username,
      email,
      hashedPassword,
      calculator_code,
      telefone || null,
      morada || null
    );

    return res.status(201).json({
      message: 'Utilizador registado com sucesso',
      user: newUser
    });
  } catch (err) {
    console.error('❌ Erro no registo:', err.message);
    return res.status(500).json({ error: 'Erro ao registar utilizador.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou password incorretos.' });
    }

    // Verificar password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou password incorretos.' });
    }

    return res.json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        username: user.nome,
        email: user.email,
        calculator_code: user.calculadora_code
      }
    });
  } catch (err) {
    console.error('❌ Erro no login:', err.message);
    return res.status(500).json({ error: 'Erro ao efetuar login.' });
  }
});

// ========================================
// ROTAS DA CALCULADORA
// ========================================

// Atualizar código da calculadora
app.put('/api/users/:userId/calculator-code', async (req, res) => {
  try {
    const { userId } = req.params;
    const { calculatorCode } = req.body;

    if (!calculatorCode) {
      return res.status(400).json({ error: 'Código da calculadora obrigatório.' });
    }

    const updatedUser = await userService.updateCalculatorCode(userId, calculatorCode);

    return res.json({
      message: 'Código da calculadora atualizado',
      user: updatedUser
    });
  } catch (err) {
    console.error('❌ Erro ao atualizar código:', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar código.' });
  }
});

// Obter utilizadores (apenas para debug/admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    console.error('❌ Erro ao obter utilizadores:', err.message);
    return res.status(500).json({ error: 'Erro ao obter utilizadores.' });
  }
});

// ========================================
// ROTAS DE ALERTAS
// ========================================

// Enviar alerta
app.post('/api/alert', async (req, res) => {
  try {
    const { user_id, device_id, origem = 'APP', status = 'EM PROCESSO', latitude, longitude } = req.body;
    
    if (latitude == null || longitude == null) {
      return res.status(400).json({ error: 'latitude e longitude são obrigatórios.' });
    }
    
    const alert = await alertService.createAlert({ 
      user_id: user_id || null, 
      device_id: device_id || null, 
      origem, 
      status, 
      latitude, 
      longitude 
    });
    
    return res.status(201).json({ message: 'Alerta guardado com sucesso', alert });
  } catch (err) {
    console.error('❌ Erro ao guardar alerta:', err.message);
    return res.status(500).json({ error: 'Erro ao guardar alerta.' });
  }
});

// Obter todos os alertas (para admin/polícia)
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await alertService.getAllAlerts();
    return res.json(alerts);
  } catch (err) {
    console.error('❌ Erro ao obter alertas:', err.message);
    return res.status(500).json({ error: 'Erro ao obter alertas.' });
  }
});

// Atualizar status do alerta
app.put('/api/alerts/:alertId/status', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório.' });
    }

    const alert = await alertService.updateAlertStatus(alertId, status);
    return res.json({ message: 'Status atualizado com sucesso', alert });
  } catch (err) {
    console.error('❌ Erro ao atualizar status:', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
});

// Apagar alerta
app.delete('/api/alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;

    const deleted = await alertService.deleteAlert(alertId);
    if (!deleted) {
      return res.status(404).json({ error: 'Alerta não encontrado.' });
    }

    return res.json({ message: 'Alerta apagado com sucesso' });
  } catch (err) {
    console.error('❌ Erro ao apagar alerta:', err.message);
    return res.status(500).json({ error: 'Erro ao apagar alerta.' });
  }
});

// ========================================
// HEALTH CHECK
// ========================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    backend: BACKEND,
    timestamp: new Date().toISOString() 
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  console.log(`📦 Backend: ${BACKEND.toUpperCase()}`);
});
