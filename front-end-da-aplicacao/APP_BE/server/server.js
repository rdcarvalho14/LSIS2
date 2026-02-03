require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const userService = require('./userService');
const alertService = require('./alertService');
const policeService = require('./policeService');
const aggressorService = require('./aggressorService');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Inicializar tabelas ao arrancar
userService.createUsersTable();
alertService.createAlertTables();
aggressorService.createAggressorsTable();

// ROTAS DE AUTENTICAÇÃO

// Registar novo utilizador
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, calculator_code, telefone, morada } = req.body;

    console.log(' Registo recebido:', { username, email, calculator_code });

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
      calculator_code ,
      telefone || null,
      morada || null
    );

    return res.status(201).json({
      message: 'Utilizador registado com sucesso',
      user: newUser
    });
  } catch (err) {
    console.error('Erro no registo:', err.message);
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
    console.error('Erro no login:', err.message);
    return res.status(500).json({ error: 'Erro ao efetuar login.' });
  }
});

// ROTAS DA CALCULADORA

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
    console.error('Erro ao atualizar código:', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar código.' });
  }
});

// Obter utilizadores (apenas para debug/admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    console.error('Erro ao obter utilizadores:', err.message);
    return res.status(500).json({ error: 'Erro ao obter utilizadores.' });
  }
});

// Atualizar foto do utilizador
app.put('/api/users/:userId/photo', async (req, res) => {
  try {
    const { userId } = req.params;
    const { photo } = req.body;

    const updatedUser = await userService.updateUserPhoto(userId, photo);

    if (!updatedUser) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    return res.json({
      message: 'Foto atualizada com sucesso',
      user: updatedUser
    });
  } catch (err) {
    console.error('❌ Erro ao atualizar foto:', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar foto.' });
  }
});

// Obter foto do utilizador
app.get('/api/users/:userId/photo', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    return res.json({ photo: user.photo });
  } catch (err) {
    console.error('❌ Erro ao obter foto:', err.message);
    return res.status(500).json({ error: 'Erro ao obter foto.' });
  }
});

// Enviar alerta
app.post('/api/alert', async (req, res) => {
  try {
    const { user_id, device_id, origem = 'APP', status = 'EM PROCESSO', latitude, longitude } = req.body;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ error: 'latitude e longitude são obrigatórios.' });
    }
    const alert = await alertService.createAlert({ user_id: user_id || null, device_id: device_id || null, origem, status, latitude, longitude });
    return res.status(201).json({ message: 'Alerta guardado com sucesso', alert });
  } catch (err) {
    console.error('Erro ao guardar alerta:', err.message);
    return res.status(500).json({ error: 'Erro ao guardar alerta.' });
  }
});

// Buscar todos os alertas
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await alertService.getAllAlerts();
    return res.json(alerts);
  } catch (err) {
    console.error('Erro ao buscar alertas:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar alertas.' });
  }
});

// Atualizar status de alerta
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
    console.error('Erro ao atualizar status:', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
});

// Apagar alerta
app.delete('/api/alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;

    const deleted = await alertService.deleteAlert(alertId);
    if (!deleted) {
      return res.status(404).json({ error: 'Alerta nao encontrado.' });
    }

    return res.json({ message: 'Alerta apagado com sucesso' });
  } catch (err) {
    console.error('Erro ao apagar alerta:', err.message);
    return res.status(500).json({ error: 'Erro ao apagar alerta.' });
  }
});

// Atualizar localização do alerta (tracking em tempo real)
app.put('/api/alerts/:alertId/location', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { latitude, longitude } = req.body;
    
    if (latitude == null || longitude == null) {
      return res.status(400).json({ error: 'Latitude e longitude sao obrigatorios.' });
    }
    
    const alert = await alertService.updateAlertLocation(alertId, latitude, longitude);
    if (!alert) {
      return res.status(404).json({ error: 'Alerta nao encontrado.' });
    }
    
    console.log(`📍 Localizacao atualizada para alerta ${alertId}: ${latitude}, ${longitude}`);
    return res.json({ message: 'Localizacao atualizada com sucesso', alert });
  } catch (err) {
    console.error('Erro ao atualizar localizacao:', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar localizacao.' });
  }
});

// ========================================
// ROTAS DO AGRESSOR
// ========================================

// Guardar/atualizar informações do agressor
app.post('/api/aggressor/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, carPlate, description, photo } = req.body;

    console.log('📝 Guardando informações do agressor para user:', userId);

    const aggressor = await aggressorService.saveAggressor(userId, {
      name,
      phone,
      carPlate,
      description,
      photo
    });

    return res.status(201).json({
      message: 'Informações do agressor guardadas com sucesso',
      aggressor
    });
  } catch (err) {
    console.error('❌ Erro ao guardar agressor:', err.message);
    return res.status(500).json({ error: 'Erro ao guardar informações do agressor.' });
  }
});

// Obter informações do agressor
app.get('/api/aggressor/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const aggressor = await aggressorService.getAggressorByUserId(userId);

    if (!aggressor) {
      return res.status(404).json({ message: 'Nenhuma informação do agressor encontrada.' });
    }

    return res.json({ aggressor });
  } catch (err) {
    console.error('❌ Erro ao buscar agressor:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar informações do agressor.' });
  }
});

// Obter dados completos da vítima e agressor (para a dashboard da polícia)
app.get('/api/victim-details/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar dados da vítima (incluindo foto)
    const victimQuery = 'SELECT id, nome, email, telefone, morada, photo, created_at FROM users WHERE id = $1';
    const victimResult = await userService.pool.query(victimQuery, [userId]);
    
    if (victimResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vítima não encontrada.' });
    }

    const victim = victimResult.rows[0];

    // Buscar dados do agressor
    const aggressor = await aggressorService.getAggressorByUserId(userId);

    return res.json({
      victim: {
        id: victim.id,
        nome: victim.nome,
        email: victim.email,
        telefone: victim.telefone,
        morada: victim.morada,
        photo: victim.photo,
        created_at: victim.created_at
      },
      aggressor: aggressor ? {
        name: aggressor.name,
        phone: aggressor.phone,
        carPlate: aggressor.car_plate,
        description: aggressor.description,
        photo: aggressor.photo
      } : null
    });
  } catch (err) {
    console.error('❌ Erro ao buscar detalhes da vítima:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar detalhes.' });
  }
});

// Apagar informações do agressor
app.delete('/api/aggressor/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await aggressorService.deleteAggressor(userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Informações do agressor não encontradas.' });
    }

    return res.json({ message: 'Informações do agressor apagadas com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao apagar agressor:', err.message);
    return res.status(500).json({ error: 'Erro ao apagar informações do agressor.' });
  }
});

// ========================================
// ROTAS DE AUTENTICAÇÃO - POLÍCIA
// ========================================

// Registar novo utilizador polícia
app.post('/api/police/register', async (req, res) => {
  try {
    const { nome, email, password, confirmPassword } = req.body;

    console.log('👮 Registo polícia recebido:', { nome, email });

    // Validações
    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e password são obrigatórios.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As passwords não coincidem.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A password deve ter pelo menos 6 caracteres.' });
    }

    // Verificar se utilizador já existe
    const existingUser = await policeService.getPoliceUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email já registado.' });
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar utilizador polícia
    const newUser = await policeService.createPoliceUser(nome, email, hashedPassword);

    return res.status(201).json({
      message: 'Utilizador polícia registado com sucesso',
      user: newUser
    });
  } catch (err) {
    console.error('❌ Erro no registo polícia:', err.message);
    return res.status(500).json({ error: 'Erro ao registar utilizador.' });
  }
});

// Login polícia
app.post('/api/police/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    const user = await policeService.getPoliceUserByEmail(email);
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
        nome: user.nome,
        email: user.email,
        role: 'police'
      }
    });
  } catch (err) {
    console.error('❌ Erro no login polícia:', err.message);
    return res.status(500).json({ error: 'Erro ao efetuar login.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Servidor a correr em http://localhost:${PORT}`);
});
