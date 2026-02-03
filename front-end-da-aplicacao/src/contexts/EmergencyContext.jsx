// EmergencyContext - Contatos e alertas de emergência
import { createContext, useState, useEffect, useRef } from 'react';
import { contactsStorage, aggressorStorage } from '../services/storage';
import { getCurrentPosition, formatLocationUrl, formatLocationText } from '../services/geolocation';
import { chatAPI } from '../services/chatAPI';
import { alertsAPI } from '../services/alertsAPI';
import { DEFAULT_ALERT_MESSAGE, MAX_TRUSTED_CONTACTS } from '../utils/constants';
import bleService from '../services/bleService';

export const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [aggressorInfo, setAggressorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bleConnected, setBleConnected] = useState(false);
  const [activeAlertId, setActiveAlertId] = useState(null);
  
  // Ref para o intervalo de tracking de localização
  const locationTrackingRef = useRef(null);
  
  useEffect(() => {
    loadData();
    
    // Cleanup ao desmontar
    return () => {
      if (locationTrackingRef.current) {
        clearInterval(locationTrackingRef.current);
      }
    };
  }, []);
  
  // Iniciar tracking de localização quando há alerta ativo
  const startLocationTracking = (alertId) => {
    console.log('📍 Iniciando tracking de localização para alerta:', alertId);
    
    // Limpar intervalo anterior se existir
    if (locationTrackingRef.current) {
      clearInterval(locationTrackingRef.current);
    }
    
    // Enviar localização a cada 5 segundos
    locationTrackingRef.current = setInterval(async () => {
      try {
        const location = await getCurrentPosition();
        await alertsAPI.updateAlertLocation(alertId, location.latitude, location.longitude);
        console.log('📍 Localização atualizada:', location.latitude, location.longitude);
      } catch (err) {
        console.warn('⚠️ Erro ao atualizar localização:', err.message);
      }
    }, 5000); // 5 segundos
  };
  
  // Parar tracking de localização
  const stopLocationTracking = () => {
    if (locationTrackingRef.current) {
      clearInterval(locationTrackingRef.current);
      locationTrackingRef.current = null;
      console.log('📍 Tracking de localização parado');
    }
    setActiveAlertId(null);
  };
  
  const loadData = async () => {
    try {
      setLoading(true);
      const [contactsData, aggressorData] = await Promise.all([
        contactsStorage.getAll(),
        aggressorStorage.get(),
      ]);
      setContacts(contactsData);
      setAggressorInfo(aggressorData);
    } catch (err) {
      console.error('Erro ao carregar dados de emergência:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const addContact = async (contact) => {
    if (contacts.length >= MAX_TRUSTED_CONTACTS) {
      throw new Error(`Máximo de ${MAX_TRUSTED_CONTACTS} contatos permitidos.`);
    }
    
    try {
      const id = await contactsStorage.add(contact);
      const newContact = { ...contact, id };
      setContacts(prev => [...prev, newContact]);
      return id;
    } catch (err) {
      console.error('Erro ao adicionar contato:', err);
      throw err;
    }
  };
  
  const updateContact = async (id, updates) => {
    try {
      await contactsStorage.update(id, updates);
      setContacts(prev =>
        prev.map(c => c.id === id ? { ...c, ...updates } : c)
      );
    } catch (err) {
      console.error('Erro ao atualizar contato:', err);
      throw err;
    }
  };
  
  const removeContact = async (id) => {
    try {
      await contactsStorage.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Erro ao remover contato:', err);
      throw err;
    }
  };
  
  const saveAggressorInfo = async (info) => {
    try {
      await aggressorStorage.save(info);
      setAggressorInfo(info);
    } catch (err) {
      console.error('Erro ao salvar informações do agressor:', err);
      throw err;
    }
  };
  
  const triggerSilentAlert = async ({ triggerSource = 'app' } = {}) => {
    try {
      const location = await getCurrentPosition();
      const activeContacts = contacts.filter(c => c.active);
      
      const locationUrl = formatLocationUrl(location.latitude, location.longitude);
      const locationText = formatLocationText(location.latitude, location.longitude);
      const message = `${DEFAULT_ALERT_MESSAGE}\n${locationText}\n${locationUrl}`;
      
      // Enviar alerta para a dashboard policial (mesmo sem contactos ativos)
      console.log('🚨 [EmergencyContext] Sending alert to backend...');
      const userId = localStorage.getItem('userId'); // Ou obter do contexto de autenticação
      console.log('👤 User ID from localStorage:', userId);

      const originPayload = triggerSource === 'app_device' ? 'APP_DEVICE' : 'APP';

      const alertResponse = await alertsAPI.createAlert({
        user_id: userId || null,
        origem: originPayload,
        status: 'EM PROCESSO',
        latitude: location.latitude,
        longitude: location.longitude,
      });
      console.log('✅ Alert sent to police dashboard successfully!');
      
      // Guardar o ID do alerta e iniciar tracking de localização
      if (alertResponse?.alert?.id) {
        setActiveAlertId(alertResponse.alert.id);
        startLocationTracking(alertResponse.alert.id);
      }

      // Enviar alerta para contatos de confiança (se houver)
      if (activeContacts.length > 0) {
        try {
          await chatAPI.sendSilentAlert(location, activeContacts);
        } catch (err) {
          console.warn('⚠️ Falha ao notificar contactos, mas alerta foi enviado para a dashboard:', err);
        }
      } else {
        console.warn('⚠️ Nenhum contato ativo configurado. Alerta enviado apenas para a dashboard.');
      }
      
      console.log('⚠️ ALERTA SILENCIOSO ACIONADO:', {
        location,
        contacts: activeContacts.length,
        message,
      });
      
      return {
        success: true,
        location,
        message,
        notifiedContacts: activeContacts.length,
      };
    } catch (err) {
      console.error('Erro ao enviar alerta silencioso:', err);
      throw err;
    }
  };

  const connectBLEButton = async () => {
    try {
      if (!bleService.isSupported()) {
        throw new Error('Bluetooth não suportado. Use Chrome, Edge ou Opera.');
      }

      await bleService.connect(() => {
        console.log('🚨 SOS recebido do botão BLE!');
        triggerSilentAlert({ triggerSource: 'app_device' });
      });

      setBleConnected(true);
      console.log('✅ Botão BLE conectado com sucesso');
      return true;
    } catch (err) {
      console.error('❌ Erro ao conectar botão BLE:', err);
      throw err;
    }
  };

  const disconnectBLEButton = async () => {
    try {
      await bleService.disconnect();
      setBleConnected(false);
      console.log('🔌 Botão BLE desconectado');
    } catch (err) {
      console.error('Erro ao desconectar botão BLE:', err);
      throw err;
    }
  };
  
  return (
    <EmergencyContext.Provider
      value={{
        contacts,
        aggressorInfo,
        loading,
        bleConnected,
        activeAlertId,
        addContact,
        updateContact,
        removeContact,
        saveAggressorInfo,
        triggerSilentAlert,
        connectBLEButton,
        disconnectBLEButton,
        stopLocationTracking,
        refreshData: loadData,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};
