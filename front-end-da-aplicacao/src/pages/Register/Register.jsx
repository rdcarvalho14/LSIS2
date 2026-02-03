import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../Setup/Setup.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    calculator_code: '',
    telefone: '',
    morada: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações
    if (!formData.username || !formData.email || !formData.password) {
      setError('Nome, email e password são obrigatórios');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.calculator_code && formData.calculator_code.length !== 4) {
      setError('Código da calculadora deve ter 4 dígitos');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email.trim(),
        password: formData.password,
        calculator_code: formData.calculator_code || null,
        telefone: formData.telefone || null,
        morada: formData.morada || null
      };

      await register(userData);
      
      // Redirecionar para calculadora após registo bem-sucedido
      navigate('/calculator', { replace: true });
    } catch (err) {
      setError(err.message || 'Erro ao registar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-header">
        <h1 className="setup-title">Calc4Life</h1>
        <p className="setup-subtitle">Crie o seu espaço seguro.</p>
      </div>

      <div className="setup-card">
        <div className="setup-form-wrapper">
          <form onSubmit={handleSubmit} className="setup-form">
            {/* Nome */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nome completo"
              required
              className="input-field"
              disabled={loading}
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="input-field"
              disabled={loading}
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="input-field"
              disabled={loading}
            />

            {/* Confirmar Password */}
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar Password"
              required
              className="input-field"
              disabled={loading}
            />

            {/* Telefone (opcional) */}
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Telefone (opcional)"
              className="input-field"
              disabled={loading}
            />

            {/* Morada (opcional) */}
            <input
              type="text"
              name="morada"
              value={formData.morada}
              onChange={handleChange}
              placeholder="Morada (opcional)"
              className="input-field"
              disabled={loading}
            />

            {/* Código da Calculadora (opcional) */}
            <input
              type="text"
              name="calculator_code"
              value={formData.calculator_code}
              onChange={handleChange}
              placeholder="Código da Calculadora (4 dígitos, opcional)"
              maxLength="4"
              className="input-field"
              disabled={loading}
            />

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Registando...' : 'Registar'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1rem' }}>
              Já tem conta?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{ cursor: 'pointer', color: '#FF6B6B', fontWeight: 'bold', fontSize: '1.05rem' }}
              >
                Entrar aqui
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
