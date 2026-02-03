import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../Setup/Setup.css';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithBackend } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithBackend(email.trim(), password);
      navigate('/calculator', { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciais incorretas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-header">
        <h1 className="setup-title">Entrar</h1>
        <p className="setup-subtitle">Use seu email e senha para entrar</p>
      </div>

      <div className="setup-card">
        <div className="setup-form-wrapper">
          <form onSubmit={handleSubmit} className="setup-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
              className="input-field"
              disabled={loading}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoComplete="current-password"
              required
              className="input-field"
              disabled={loading}
            />

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1rem' }}>
              Não tem conta?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{ cursor: 'pointer', color: '#FF6B6B', fontWeight: 'bold', fontSize: '1.05rem' }}
              >
                Registar aqui
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
