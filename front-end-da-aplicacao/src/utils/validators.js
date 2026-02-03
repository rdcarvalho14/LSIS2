// Validações frontend
import { VALIDATION } from './constants';

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+351)?[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  if (!password || password.length < VALIDATION.minPasswordLength) {
    return {
      valid: false,
      message: `A senha deve ter pelo menos ${VALIDATION.minPasswordLength} caracteres.`
    };
  }
  return { valid: true };
};

export const validateDiaryText = (text) => {
  if (!text || text.trim().length === 0) {
    return {
      valid: false,
      message: 'O texto não pode estar vazio.'
    };
  }
  
  if (text.length > VALIDATION.maxDiaryTextLength) {
    return {
      valid: false,
      message: `O texto não pode ter mais de ${VALIDATION.maxDiaryTextLength} caracteres.`
    };
  }
  
  return { valid: true };
};

export const validatePhotoSize = (file) => {
  if (file.size > VALIDATION.maxPhotoSize) {
    return {
      valid: false,
      message: 'A foto não pode ter mais de 5MB.'
    };
  }
  return { valid: true };
};

export const validateContactName = (name) => {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      message: 'O nome não pode estar vazio.'
    };
  }
  
  if (name.length > 100) {
    return {
      valid: false,
      message: 'O nome não pode ter mais de 100 caracteres.'
    };
  }
  
  return { valid: true };
};

export const validateRequired = (value, fieldName = 'Campo') => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return {
      valid: false,
      message: `${fieldName} é obrigatório.`
    };
  }
  return { valid: true };
};
