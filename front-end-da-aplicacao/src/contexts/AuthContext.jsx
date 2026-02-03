// AuthContext - Controle de acesso secreto
import { createContext, useState, useEffect } from 'react';
import { hashPassword } from '../services/crypto';
import { settingsStorage } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

const getDefaultApiUrl = () => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5000`;
  }
  return 'http://localhost:5000';
};

const isLocalDevHost = (hostname) => hostname === 'localhost' || hostname === '127.0.0.1';

const resolveApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (typeof window !== 'undefined' && isLocalDevHost(window.location.hostname)) {
    return getDefaultApiUrl();
  }
  if (envUrl) return envUrl.replace(/\/$/, '');
  return getDefaultApiUrl();
};

const API_URL = resolveApiUrl();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(null); // null = loading
  const [currentUser, setCurrentUser] = useState(null);
  
  // Carregar currentUser do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (e) {
        console.error('Erro ao carregar utilizador:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Verifica se já foi configurado ao montar
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const passwordHash = await settingsStorage.get('passwordHash');
        setIsSetupComplete(!!passwordHash);
      } catch (error) {
        console.error('Erro ao verificar setup:', error);
        setIsSetupComplete(false);
      }
    };
    checkSetup();
  }, []);
  
  // Configurar usuário inicial (nome, nascimento, deviceId), código e credenciais
  // params: userData { name, birthDate, email }, codePassword (4 dígitos), authPassword (email password)
  const setupUser = async (userData, codePassword, authPassword) => {
    try {
      const deviceId = uuidv4();
      const codeHash = await hashPassword(codePassword);
      await settingsStorage.set('passwordHash', codeHash); // mantém compatibilidade com código de 4 dígitos

      if (userData?.email && authPassword) {
        const authHash = await hashPassword(authPassword);
        await settingsStorage.set('email', userData.email);
        await settingsStorage.set('authPasswordHash', authHash);
      }

      await settingsStorage.set('userName', userData.name);
      await settingsStorage.set('birthDate', userData.birthDate);
      await settingsStorage.set('deviceId', deviceId);

      setIsSetupComplete(true);
      return { deviceId };
    } catch (error) {
      console.error('Erro ao configurar usuário:', error);
      throw error;
    }
  };
  
  // Configurar senha inicial (para compatibilidade)
  const setupPassword = async (password) => {
    try {
      const hash = await hashPassword(password);
      await settingsStorage.set('passwordHash', hash);
      setIsSetupComplete(true);
      return true;
    } catch (error) {
      console.error('Erro ao configurar senha:', error);
      throw error;
    }
  };
  
  // Verificar senha
  const checkPassword = (inputPassword) => {
    return settingsStorage.get('passwordHash').then(async (storedHash) => {
      if (!storedHash) return false;
      const inputHash = await hashPassword(inputPassword);
      return inputHash === storedHash;
    }).catch(() => false);
  };

  // Verifica credenciais de email e password
  const checkCredentials = (email, password) => {
    return settingsStorage.get('email').then(async (storedEmail) => {
      if (!storedEmail || storedEmail !== email) return false;
      const storedHash = await settingsStorage.get('authPasswordHash');
      if (!storedHash) return false;
      const inputHash = await hashPassword(password);
      return inputHash === storedHash;
    }).catch(() => false);
  };

  // Registar novo utilizador no backend
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registar');
      }

      const data = await response.json();
      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Salvar userId no localStorage para usar nos alertas
      if (data.user.id) {
        localStorage.setItem('userId', data.user.id);
        console.log('💾 UserId saved to localStorage:', data.user.id);
      }
      
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      console.error('Erro no registo:', error);
      throw error;
    }
  };

  // Login com backend
  const loginWithBackend = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Credenciais incorretas');
      }

      const data = await response.json();
      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Salvar userId no localStorage para usar nos alertas
      if (data.user.id) {
        localStorage.setItem('userId', data.user.id);
        console.log('💾 UserId saved to localStorage:', data.user.id);
      }
      
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };
  
  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  // DESABILITADO TEMPORARIAMENTE PARA TESTES
  /*
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Apenas desloga se a aba ficar oculta por mais de 30 segundos
      if (document.hidden && isAuthenticated) {
        const hideTimer = setTimeout(() => {
          if (document.hidden) {
            console.log('App minimizado por muito tempo - retornando ao disfarce');
            logout();
          }
        }, 30000); // 30 segundos
        
        const showHandler = () => {
          clearTimeout(hideTimer);
        };
        
        document.addEventListener('visibilitychange', showHandler, { once: true });
        
        return () => {
          clearTimeout(hideTimer);
        };
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  */
  
  // DESABILITADO TEMPORARIAMENTE PARA TESTES
  /*
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let inactivityTimer;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log('Inatividade detectada - retornando ao disfarce');
        logout();
      }, 5 * 60 * 1000);
    };
    
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });
    
    resetTimer();
    
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  */
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isSetupComplete,
      currentUser,
      login, 
      logout,
      setupPassword,
      setupUser,
      checkPassword,
      checkCredentials,
      register,
      loginWithBackend
    }}>
      {children}
    </AuthContext.Provider>
  );
};
