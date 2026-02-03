
import React from 'react';
import { Link } from 'react-router-dom';
import SOSButton from '../../components/EmergencyButton/SOSButton';
import BLEButton from '../../components/BLEButton/BLEButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Home.css';

/**
 * Home - Tela Principal (Tela 1)
 * Painel principal com navegação e botões de emergência
 * Rota protegida - apenas usuários autenticados
 */

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleBackToCalc = () => {
    navigate('/calculator', { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-top">
          <button onClick={handleBackToCalc} className="back-button" aria-label="Voltar para calculadora">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="calc-emoji">🖩</span>
        </div>
        <h1>
          <span style={{ fontWeight: 600 }}>Bem-vinda,</span><br />
          <span className="subtitle-highlight">Você não está sozinha.</span>
        </h1>
      </div>

      <nav className="home-menu">
        <Link to="/diary" className="menu-card">
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3Z" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7H15M9 11H15M9 15H13" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Diário Seguro</h3>
            <p>Registre suas experiências de forma privada</p>
          </div>
        </Link>

        <Link to="/personal-data" className="menu-card">
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Dados Pessoais</h3>
            <p>Suas informações pessoais</p>
          </div>
        </Link>

        <Link to="/aggressor-info" className="menu-card">
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Informações do Agressor</h3>
            <p>Dados importantes para sua segurança</p>
          </div>
        </Link>

        <Link to="/network" className="menu-card">
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Rede de Apoio</h3>
            <p>Seus contatos de confiança</p>
          </div>
        </Link>

        <Link to="/resources" className="menu-card">
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Recursos</h3>
            <p>Informações e ajuda disponível</p>
          </div>
        </Link>

        <Link to="/chat" className="menu-card">
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="var(--primary-color, #FF4C4C)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Chat de Apoio</h3>
            <p>Converse com nossa equipe</p>
          </div>
        </Link>
      </nav>

      <div className="ble-section">
        <BLEButton />
      </div>

      <div className="emergency-section">
        <SOSButton />
      </div>
    </div>
  );
};

export default Home;
