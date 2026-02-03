// App.jsx - Componente raiz com rotas
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DiaryProvider } from './contexts/DiaryContext';
import { EmergencyProvider } from './contexts/EmergencyContext';
import { useAuth } from './hooks/useAuth';

// Páginas
import Calculator from './pages/Calculator/Calculator';
import Home from './pages/Home/Home';
import Diary from './pages/Diary/Diary';
import Network from './pages/Network/Network';
import PersonalData from './pages/PersonalData';
import AggressorInfo from './pages/AggressorInfo/AggressorInfo';
import Resources from './pages/Resources/Resources';
import SafetyPlan from './pages/SafetyPlan/SafetyPlan';
import Chat from './pages/Chat/Chat';
import Setup from './pages/Setup/Setup';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PoliceDashboard from './pages/PoliceDashboard';
import PoliceLogin from './pages/PoliceLogin/PoliceLogin';
import PoliceRegister from './pages/PoliceLogin/PoliceRegister';

// PrivateRoute - Protege rotas internas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated || location.pathname === '/setup' ? children : <Navigate to="/" replace />;
};

// Layout com Providers
const AppContent = () => {
  const { isSetupComplete } = useAuth();
  const isDashboardOnly = process.env.REACT_APP_DASHBOARD_ONLY === 'true';

  if (isDashboardOnly) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/police-dashboard" replace />} />
        <Route path="/police-dashboard" element={<PoliceDashboard />} />
        <Route path="*" element={<Navigate to="/police-dashboard" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Rotas públicas - sem senha */}
      <Route path="/personal-data" element={<PersonalData />} />
      <Route path="/aggressor-info" element={<AggressorInfo />} />
      <Route path="/safety-plan" element={<SafetyPlan />} />
      
      {/* Tela 0: Registo ou Login */}
      <Route path="/" element={<Register />} />
      
      {/* Rota para setup/login */}
      <Route path="/setup" element={<Setup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Calculadora - após login */}
      <Route path="/calculator" element={<Calculator />} />
      
      {/* Rotas protegidas */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/diary"
        element={
          <PrivateRoute>
            <Diary />
          </PrivateRoute>
        }
      />
      <Route
        path="/network"
        element={
          <PrivateRoute>
            <Network />
          </PrivateRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <PrivateRoute>
            <Resources />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      
      {/* Dashboard Policial - Acesso Público */}
      <Route path="/police-dashboard" element={<PoliceDashboard />} />
      
      {/* Autenticação Polícia */}
      <Route path="/police/login" element={<PoliceLogin />} />
      <Route path="/police/register" element={<PoliceRegister />} />
      
      {/* Fallback - Qualquer rota não encontrada volta para calculadora */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DiaryProvider>
          <EmergencyProvider>
            <AppContent />
          </EmergencyProvider>
        </DiaryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
