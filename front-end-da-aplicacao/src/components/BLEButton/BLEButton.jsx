import React, { useContext, useState } from 'react';
import { EmergencyContext } from '../../contexts/EmergencyContext';
import './BLEButton.css';

const BLEButton = () => {
  const { bleConnected, connectBLEButton, disconnectBLEButton } = useContext(EmergencyContext);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setConnecting(true);
    setError('');
    
    try {
      await connectBLEButton();
    } catch (err) {
      setError(err.message || 'Erro ao conectar botão BLE');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectBLEButton();
      setError('');
    } catch (err) {
      setError(err.message || 'Erro ao desconectar');
    }
  };

  return (
    <div className="sos-button-container">
      {error && (
        <div className="ble-error">
          ⚠️ {error}
        </div>
      )}

      {bleConnected && (
        <button
          onClick={handleDisconnect}
          className="ble-disconnect-btn"
        >
          🔌 Desconectar
        </button>
      )}
    </div>
  );
};

export default BLEButton;
