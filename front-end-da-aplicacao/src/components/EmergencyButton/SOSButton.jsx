import React, { useState, useContext, useEffect } from 'react';
import { EmergencyContext } from '../../contexts/EmergencyContext';
import { useSOSButton } from '../../hooks/useSOSButton';
import './SOSButton.css';

const SOSButton = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { triggerSilentAlert } = useContext(EmergencyContext);

  useEffect(() => {
    if (!success) return;
    const timeoutId = setTimeout(() => setSuccess(false), 5000);
    return () => clearTimeout(timeoutId);
  }, [success]);

  // Função principal de SOS que será chamada tanto pelo botão na app quanto pelo botão físico
  const handleSOS = async (triggerSource = 'app') => {
    console.log('🚨 [SOSButton] Triggered!');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await triggerSilentAlert({ triggerSource });
      setSuccess(true);
      console.log('✅ [SOSButton] Alert sent successfully!');
    } catch (e) {
      console.error('❌ [SOSButton] Error:', e);
      setError(e.message || 'Falha ao enviar alerta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Hook do botão físico BLE - passa a função handleSOS como callback
  const { isConnected, error: bleError, connect, disconnect, isSupported } = useSOSButton(() => handleSOS('app_device'));

  return (
    <div className="sos-container">
      {/* Status da conexão BLE - apenas se o browser suportar */}
      {isSupported && (
        <div className="sos-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
          <span className="status-text">
            Botão Físico: {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
          
          {!isConnected ? (
            <button onClick={connect} className="btn-connect" type="button">
              📡 Conectar Botão
            </button>
          ) : (
            <button onClick={disconnect} className="btn-disconnect" type="button">
              🔌 Desconectar
            </button>
          )}
        </div>
      )}

      {/* Mensagem de erro do BLE */}
      {bleError && (
        <div className="sos-ble-error">
          ⚠️ Bluetooth: {bleError}
        </div>
      )}

      {/* Botão SOS principal (o que já existia) */}
      <button
        className={`sos-button${success ? ' sos-success' : ''}`}
        onClick={() => handleSOS('app')}
        disabled={loading}
        aria-label="Botão de SOS - envia alerta para polícia e contactos de confiança"
      >
        <span className="sos-btn-text">
          {loading
            ? 'Enviando SOS...'
            : success
              ? 'Alerta enviado com sucesso'
              : '🔴 SOS - ALERTA IMEDIATO'}
        </span>
        {error && <span className="error">{error}</span>}
      </button>

      {/* Instruções do botão físico - apenas se conectado */}
      {isConnected && (
        <div className="sos-instructions">
          <p>
            💡 <strong>Botão físico conectado!</strong>
          </p>
          <p>Pressione o botão físico por 3 segundos para ativar o SOS automaticamente.</p>
        </div>
      )}
    </div>
  );
};

export default SOSButton;