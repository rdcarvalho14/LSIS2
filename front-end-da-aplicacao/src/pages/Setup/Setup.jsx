import React, { useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Setup.css';

/**
 * Setup - Tela de Configuração Inicial ou Login
 * Aparece na primeira vez para registro, ou para login quando logout
 */
const Setup = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [confirmAuthPassword, setConfirmAuthPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const navigate = useNavigate();
  const { setupUser, isSetupComplete, login, checkPassword } = useAuth();
  const { getLocation } = useGeolocation();

  // Solicita localização ao montar
  React.useEffect(() => {
    (async () => {
      try {
        await getLocation();
        setLocationAllowed(true);
        setLocationError('');
      } catch (e) {
        setLocationAllowed(false);
        setLocationError('É necessário permitir acesso à localização para usar o app.');
      }
    })();
  }, [getLocation]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 4) {
      setError('Código deve ter 4 números');
      return;
    }

    const isCorrect = await checkPassword(password);
    if (isCorrect) {
      login();
      navigate('/home', { replace: true });
    } else {
      setError('Código incorreto');
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');

    // Validar campos obrigatórios
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!birthDate) {
      setError('Data de nascimento é obrigatória');
      return;
    }

    // Validar senha (mínimo 4 dígitos)
    if (password.length < 4) {
      setError('Código deve ter 4 números');
      return;
    }

    // Validar email e password de conta (opcionalmente exigir)
    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    if (authPassword.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (authPassword !== confirmAuthPassword) {
      setError('Senhas não coincidem');
      return;
    }

    // Verificar confirmação
    if (password !== confirmPassword) {
      setError('Códigos não coincidem');
      return;
    }

    if (!locationAllowed) {
      setError('Permita o acesso à localização para continuar.');
      return;
    }

    try {
      const result = await setupUser({ name: name.trim(), birthDate, email: email.trim() }, password, authPassword);
      setDeviceId(result.deviceId);
      // Não navegar ainda, mostrar o deviceId
      setError(''); // limpar erro
    } catch (err) {
      setError('Erro ao configurar. Tente novamente.');
    }
  };

  const isRegisterDisabled =
    !name.trim() ||
    !birthDate ||
    !email.trim() ||
    !authPassword ||
    !confirmAuthPassword ||
    !password ||
    !confirmPassword;

  return (
    <div className="setup-container">
      <div className="setup-header">
        <h1 className="setup-title">
          {isSetupComplete ? (deviceId ? 'Configuração Completa' : 'Acesso') : 'Bem-vinda'}
        </h1>
        <p className="setup-subtitle">
          {isSetupComplete 
            ? (deviceId ? 'Seu ID de dispositivo é:' : 'Digite seu código de 4 números')
            : 'Preencha seus dados e crie um código de 4 números'
          }
        </p>
      </div>

      <div className="setup-card">
        {isSetupComplete ? (
          // Tela de Login
          deviceId ? (
            // Após setup, mostrar deviceId
            <>
              <div className="setup-form-wrapper">
                <div className="device-id-display">
                  <code>{deviceId}</code>
                </div>
                <p className="setup-info">Guarde este ID em local seguro. Ele é único para este dispositivo.</p>
                <button 
                  onClick={() => navigate('/', { replace: true })}
                  className="btn-submit"
                >
                  Continuar
                </button>
              </div>
            </>
          ) : (
            <div className="setup-form-wrapper">
              <form onSubmit={handleLogin} className="setup-form">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  autoComplete="off"
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="4"
                  className="input-field password-input"
                />

                {error && (
                  <div className="error-message">{error}</div>
                )}

                <button 
                  type="submit" 
                  className="btn-submit" 
                  disabled={password.length < 4}
                >
                  Entrar
                </button>
              </form>
              
                <p className="setup-info">Digite na calculadora para acessar também</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => navigate('/login', { replace: true })}
                    className="btn-submit"
                    style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.08)', color: '#333' }}
                  >
                    Entrar com email
                  </button>
                </div>
            </div>
          )
        ) : (
          // Tela de Registro
          <div className="setup-form-wrapper">
            <form onSubmit={handleSetup} className="setup-form">
              {locationError && (
                <div style={{ color: '#FF6B6B', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>
                  {locationError}
                </div>
              )}

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                autoComplete="name"
                required
                className="input-field"
              />

              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Data de nascimento"
                required
                className="input-field"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
                className="input-field"
              />

              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Senha (mínimo 6 caracteres)"
                autoComplete="new-password"
                className="input-field password-input"
                required
              />

              <input
                type="password"
                value={confirmAuthPassword}
                onChange={(e) => setConfirmAuthPassword(e.target.value)}
                placeholder="Confirmar senha"
                autoComplete="new-password"
                className="input-field password-input"
                required
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Código de 4 números"
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="4"
                className="input-field password-input"
                required
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar código"
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="4"
                className="input-field password-input"
                required
              />

              {error && (
                <div className="error-message">{error}</div>
              )}

              <button 
                type="submit" 
                className="btn-submit" 
                disabled={isRegisterDisabled}
              >
                Configurar
              </button>
            </form>
            
            <p className="setup-info">Digite o código na calculadora para acessar seus dados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup;
