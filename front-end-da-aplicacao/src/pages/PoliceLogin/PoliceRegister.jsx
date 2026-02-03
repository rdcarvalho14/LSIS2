import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PoliceAuth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PoliceRegister = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (password !== confirmPassword) {
      setError('As passwords não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/police/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome: nome.trim(), 
          email: email.trim(), 
          password,
          confirmPassword 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registar');
      }

      setSuccess('Registo efetuado com sucesso!');
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/police/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao registar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="police-auth-container">
      <div className="police-auth-card">
        <div className="police-auth-header">
          <div className="police-badge">👮</div>
          <h1>Registo - Polícia</h1>
          <p>Criar nova conta de agente</p>
        </div>

        <form onSubmit={handleSubmit} className="police-auth-form">
          <div className="input-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              autoComplete="name"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@policia.pt"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a password"
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn-police-submit" disabled={loading}>
            {loading ? 'A registar...' : 'Criar Conta'}
          </button>

          <p className="auth-switch">
            Já tem conta?{' '}
            <span onClick={() => navigate('/police/login')}>
              Entrar aqui
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PoliceRegister;
