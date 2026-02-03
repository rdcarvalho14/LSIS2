// Constantes da aplicação - Números de emergência Portugal

export const EMERGENCY_CONTACTS = {
  police: '112',
  victimSupport: '116006',
  apav: '707200077',
  childLine: '116111',
  elderSupport: '800202099',
};

export const DEFAULT_ALERT_MESSAGE = 
  'Preciso de ajuda urgente. Minha localização atual:';

export const SECRET_CODE = '1991*';

export const APP_NAME = 'Calculadora';

export const PANIC_WORD = 'socorro';

export const MAX_TRUSTED_CONTACTS = 3;

export const DIARY_ENTRY_TYPES = {
  TEXT: 'text',
  PHOTO: 'photo',
  AUDIO: 'audio',
};

export const SAFETY_STATUS = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
};

export const CRYPTO_CONFIG = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  iterations: 100000,
};

export const MESSAGES = {
  welcomeTitle: 'Olá! Você não está sozinha.',
  welcomeSubtitle: 'Este é um espaço seguro e confidencial.',
  diaryEmptyState: 'Nenhuma entrada ainda. Comece a registrar seus eventos de forma segura.',
  networkEmptyState: 'Configure sua rede de apoio para receber alertas em emergências.',
  chatUnavailable: 'Chat temporariamente indisponível. Em emergência, ligue para 112.',
};

export const VALIDATION = {
  minPasswordLength: 6,
  maxDiaryTextLength: 5000,
  maxPhotoSize: 5 * 1024 * 1024,
  maxAudioDuration: 300,
};
