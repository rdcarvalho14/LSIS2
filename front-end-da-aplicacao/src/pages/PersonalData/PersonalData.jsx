import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsStorage } from '../../services/storage';
import './PersonalData.css';

const getDefaultApiUrl = () => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5000`;
  }
  return 'http://localhost:5000';
};

const isLocalDevHost = (hostname) => hostname === 'localhost' || hostname === '127.0.0.1';

const resolveApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (typeof window !== 'undefined' && isLocalDevHost(window.location.hostname)) {
    return getDefaultApiUrl();
  }
  if (envUrl) return envUrl.replace(/\/$/, '');
  return getDefaultApiUrl();
};

const API_URL = resolveApiUrl();

/**
 * PersonalData - Tela de Dados Pessoais
 * Formulário para coleta de informações pessoais da usuária
 */

const PersonalData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    moradaCompleta: '',
    telemovelPrincipal: '',
    numeroFilhos: 0,
    photo: null
  });

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      loadPhotoFromDB(storedUserId);
    }
    loadPersonalData();
  }, []);

  const loadPhotoFromDB = async (uid) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${uid}/photo`);
      if (response.ok) {
        const data = await response.json();
        if (data.photo) {
          setFormData(prev => ({ ...prev, photo: data.photo }));
          // Também guardar no localStorage como backup
          await settingsStorage.set('personalData_photo', data.photo);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar foto da BD:', error);
    }
  };

  const loadPersonalData = async () => {
    try {
      const nomeCompleto = await settingsStorage.get('personalData_nomeCompleto');
      const dataNascimento = await settingsStorage.get('personalData_dataNascimento');
      const moradaCompleta = await settingsStorage.get('personalData_moradaCompleta');
      const telemovelPrincipal = await settingsStorage.get('personalData_telemovelPrincipal');
      const numeroFilhos = await settingsStorage.get('personalData_numeroFilhos');
      const photo = await settingsStorage.get('personalData_photo');

      setFormData(prev => ({
        ...prev,
        nomeCompleto: nomeCompleto || '',
        dataNascimento: dataNascimento || '',
        moradaCompleta: moradaCompleta || '',
        telemovelPrincipal: telemovelPrincipal || '',
        numeroFilhos: numeroFilhos || 0,
        photo: prev.photo || photo || null
      }));
    } catch (error) {
      console.error('Erro ao carregar dados pessoais:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Salvar cada campo no storage local
      await settingsStorage.set('personalData_nomeCompleto', formData.nomeCompleto);
      await settingsStorage.set('personalData_dataNascimento', formData.dataNascimento);
      await settingsStorage.set('personalData_moradaCompleta', formData.moradaCompleta);
      await settingsStorage.set('personalData_telemovelPrincipal', formData.telemovelPrincipal);
      await settingsStorage.set('personalData_numeroFilhos', formData.numeroFilhos);
      await settingsStorage.set('personalData_photo', formData.photo);
      
      // Se tiver userId, também guardar foto na base de dados
      if (userId) {
        try {
          await fetch(`${API_URL}/api/users/${userId}/photo`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photo: formData.photo })
          });
          console.log('✅ Foto guardada na base de dados');
        } catch (apiError) {
          console.error('Erro ao guardar foto na BD:', apiError);
        }
      }
      
      // Feedback visual
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personal-data-container">
      {/* Header */}
      <div className="personal-data-header" style={{position: 'relative'}}>
        <button className="btn-back" onClick={() => navigate('/home')} style={{position: 'absolute', top: 0, left: 0}}>
          ← Voltar
        </button>
        <h1 style={{textAlign: 'center', color: '#FF4C4C', marginLeft: 0, marginRight: 0}}>Dados Pessoais</h1>
        <p className="subtitle" style={{textAlign: 'center'}}>Suas informações pessoais e contato</p>
      </div>

      {/* Formulário */}
      <form className="personal-data-form" onSubmit={handleSubmit}>
        {/* Nome Completo */}
        <div className="form-group">
          <label htmlFor="nomeCompleto">Nome Completo</label>
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleInputChange}
            placeholder="Seu nome completo"
            required
          />
        </div>

        {/* Data de Nascimento */}
        <div className="form-group">
          <label htmlFor="dataNascimento">Data de Nascimento</label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Morada Completa */}
        <div className="form-group">
          <label htmlFor="moradaCompleta">Morada Completa</label>
          <textarea
            id="moradaCompleta"
            name="moradaCompleta"
            value={formData.moradaCompleta}
            onChange={handleInputChange}
            placeholder="Rua, número, andar, código postal, cidade"
            rows="3"
            required
          />
        </div>

        {/* Telemóvel Principal */}
        <div className="form-group">
          <label htmlFor="telemovelPrincipal">Telemóvel Principal</label>
          <input
            type="tel"
            id="telemovelPrincipal"
            name="telemovelPrincipal"
            value={formData.telemovelPrincipal}
            onChange={handleInputChange}
            placeholder="+351 912 345 678"
            required
          />
        </div>

        {/* Número de Filhos */}
        <div className="form-group">
          <label htmlFor="numeroFilhos">N.º de Filhos (Opcional)</label>
          <input
            type="number"
            id="numeroFilhos"
            name="numeroFilhos"
            value={formData.numeroFilhos}
            onChange={handleInputChange}
            min="0"
            max="20"
            step="1"
          />
        </div>

        {/* Foto Pessoal */}
        <div className="form-group">
          <label>Foto (Opcional)</label>
          {formData.photo ? (
            <div className="photo-preview" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              marginTop: '8px'
            }}>
              <img 
                src={formData.photo} 
                alt="Foto pessoal" 
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #FF4C4C'
                }}
              />
              <button 
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Remover Foto
              </button>
            </div>
          ) : (
            <label 
              htmlFor="photo-upload" 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '20px',
                border: '2px dashed #ccc',
                borderRadius: '12px',
                cursor: 'pointer',
                background: '#f9fafb',
                marginTop: '8px',
                transition: 'all 0.2s'
              }}
            >
              📷 Adicionar Foto
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>

        {/* Botão Salvar */}
        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? 'A guardar...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default PersonalData;
