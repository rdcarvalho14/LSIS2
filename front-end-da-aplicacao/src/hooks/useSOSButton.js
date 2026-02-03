import { useEffect, useState, useCallback } from 'react';
import bleService from '../services/bleService';

export const useSOSButton = (onSOSTriggered) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const handleSOSReceived = useCallback(() => {
    console.log('🚨 Hook: SOS recebido do botão físico');
    if (onSOSTriggered) {
      onSOSTriggered();
    }
  }, [onSOSTriggered]);

  const connect = async () => {
    try {
      setError(null);
      await bleService.connect(handleSOSReceived);
      setIsConnected(true);
    } catch (err) {
      console.error('Erro na conexão:', err);
      setError(err.message);
      setIsConnected(false);
    }
  };

  const disconnect = async () => {
    try {
      await bleService.disconnect();
      setIsConnected(false);
    } catch (err) {
      console.error('Erro ao desconectar:', err);
    }
  };

  useEffect(() => {
    return () => {
      bleService.disconnect();
    };
  }, []);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    isSupported: bleService.isSupported(),
  };
};