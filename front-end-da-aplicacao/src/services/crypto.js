// Web Crypto API - Criptografia client-side
import { CRYPTO_CONFIG } from '../utils/constants';

async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: CRYPTO_CONFIG.iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: CRYPTO_CONFIG.algorithm, length: CRYPTO_CONFIG.keyLength },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(text, password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const key = await deriveKey(password, salt);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: CRYPTO_CONFIG.algorithm, iv },
      key,
      data
    );
    
    return {
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    };
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    throw new Error('Não foi possível criptografar os dados.');
  }
}

export async function decryptData(encryptedObj, password) {
  try {
    const salt = new Uint8Array(encryptedObj.salt);
    const iv = new Uint8Array(encryptedObj.iv);
    const data = new Uint8Array(encryptedObj.data);
    
    const key = await deriveKey(password, salt);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: CRYPTO_CONFIG.algorithm, iv },
      key,
      data
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    throw new Error('Senha incorreta ou dados corrompidos.');
  }
}

export async function validatePassword(password, encryptedTest) {
  try {
    await decryptData(encryptedTest, password);
    return true;
  } catch {
    return false;
  }
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
