import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PoliceAuth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PoliceLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/police/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Guardar dados do utilizador polícia
      localStorage.setItem('policeUser', JSON.stringify(data.user));
      
      // Redirecionar para dashboard da polícia
      navigate('/police/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciais incorretas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="police-auth-container">
      <div className="police-auth-card">
        <div className="police-auth-header">
          <div className="police-badge">👮</div>
          <h1>Área da Polícia</h1>
          <p>Acesso restrito a agentes autorizados</p>
        </div>

        <form onSubmit={handleSubmit} className="police-auth-form">
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
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-police-submit" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>

          <p className="auth-switch">
            Não tem conta?{' '}
            <span onClick={() => navigate('/police/register')}>
              Registar aqui
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PoliceLogin;
