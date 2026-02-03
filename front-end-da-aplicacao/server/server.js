require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const userService = require('./userService');

const app = express();
app.use(express.json());
app.use(cors());

// Inicializar tabela ao arrancar
userService.createUsersTable();

//  ROTAS DE AUTENTICAÇÃO

// Registar novo utilizador
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

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

    // Criar utilizador
    const newUser = await userService.createUser(username, email, hashedPassword, null);

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
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou password incorretos.' });
    }

    return res.json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        calculator_code: user.calculator_code
      }
    });
  } catch (err) {
    console.error('Erro no login:', err.message);
    return res.status(500).json({ error: 'Erro ao efetuar login.' });
  }
});

// 🧮 ROTAS DA CALCULADORA

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

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
});
