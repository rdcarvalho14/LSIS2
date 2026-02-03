// alertsAPI.js - Serviço para comunicação com a API de alertas
import axios from 'axios';

const getDefaultApiBaseUrl = () => {
  // In development, use relative URL so React proxy handles it
  if (process.env.NODE_ENV === 'development') {
    return '/api';
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const isLocalDevHost = (hostname) => hostname === 'localhost' || hostname === '127.0.0.1';

const resolveApiBaseUrl = () => {
  const envEndpoint = process.env.REACT_APP_API_ENDPOINT;
  const envApiUrl = process.env.REACT_APP_API_URL;

  if (typeof window !== 'undefined' && isLocalDevHost(window.location.hostname)) {
    return getDefaultApiBaseUrl();
  }

  if (envEndpoint) return envEndpoint.replace(/\/$/, '');
  if (envApiUrl) {
    return `${envApiUrl.replace(/\/$/, '')}/api`;
  }
  return getDefaultApiBaseUrl();
};

const API_BASE_URL = resolveApiBaseUrl();

export const alertsAPI = {
  // Buscar todos os alertas
  async getAllAlerts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/alerts`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      throw error;
    }
  },

  // Criar novo alerta
  async createAlert(alertData) {
    try {
      console.log('🔥 Sending alert to API:', alertData);
      const response = await axios.post(`${API_BASE_URL}/alert`, alertData);
      console.log('✅ Alert created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar alerta:', error);
      throw error;
    }
  },

  // Atualizar status do alerta
  async updateAlertStatus(alertId, status) {
    try {
      const response = await axios.put(`${API_BASE_URL}/alerts/${alertId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  // Apagar alerta
  async deleteAlert(alertId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao apagar alerta:', error);
      throw error;
    }
  },

  // Atualizar localizacao do alerta (tracking em tempo real)
  async updateAlertLocation(alertId, latitude, longitude) {
    try {
      const response = await axios.put(`${API_BASE_URL}/alerts/${alertId}/location`, { latitude, longitude });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar localizacao:', error);
      throw error;
    }
  },

  // Transformar dados do backend para o formato da dashboard
  transformAlert(alert) {
    const statusRaw = String(alert.status || '').toUpperCase();
    const originRaw = String(alert.origem || 'APP').toUpperCase();
    const hasDevice = Boolean(alert.device_id);

    const source = originRaw === 'DEVICE'
      ? 'device'
      : originRaw === 'APP_DEVICE'
      ? 'app_device'
      : originRaw === 'APP' && hasDevice
      ? 'app_device'
      : 'app';

    const latitude = parseFloat(alert.latitude);
    const longitude = parseFloat(alert.longitude);

    // Determinar status
    const status = statusRaw === 'EM PROCESSO'
      ? 'in_process'
      : statusRaw === 'EM ACOMPANHAMENTO'
      ? 'in_progress'
      : statusRaw === 'RESOLVIDO'
      ? 'resolved'
      : 'new';

    // Determinar risco com base no status
    const risk = statusRaw === 'EM ACOMPANHAMENTO'
      ? 'medium'
      : statusRaw === 'RESOLVIDO'
      ? 'low'
      : 'high';

    return {
      id: alert.id,
      userId: alert.user_id || null,
      status,
      risk,
      source,
      createdAt: alert.created_at,
      lastUpdateAt: alert.created_at,
      lat: Number.isFinite(latitude) ? latitude : null,
      lng: Number.isFinite(longitude) ? longitude : null,
      location: {
        latitude: Number.isFinite(latitude) ? latitude : null,
        longitude: Number.isFinite(longitude) ? longitude : null,
      },
      // Se tiver nome, usar identificado, senão anônimo
      ...(alert.user_name ? {
        fullName: alert.user_name,
        phone: alert.user_phone || null,
        email: alert.user_email || null,
      } : {
        anonymousId: `AN-${alert.id.slice(0, 8)}`,
      }),
      history: [
        {
          at: alert.created_at,
          event: 'Alerta criado',
          by: 'Sistema',
        },
      ],
    };
  },
};
