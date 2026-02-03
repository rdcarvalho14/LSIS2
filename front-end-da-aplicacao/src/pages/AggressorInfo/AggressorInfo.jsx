import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aggressorStorage } from '../../services/storage';
import './AggressorInfo.css';

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
 * AggressorInfo - Informações do Agressor
 * Formulário para registrar dados do agressor
 * Os dados são guardados na base de dados associados ao user_id da vítima
 */
const AggressorInfo = () => {
  const navigate = useNavigate();
  
  const [aggressor, setAggressor] = useState({
    name: '',
    phone: '',
    carPlate: '',
    description: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Obter userId do localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    loadAggressorData(storedUserId);
  }, []);

  const loadAggressorData = async (currentUserId) => {
    try {
      // Primeiro tenta carregar da base de dados se tiver userId
      if (currentUserId) {
        const response = await fetch(`${API_URL}/api/aggressor/${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.aggressor) {
            setAggressor({
              name: data.aggressor.name || '',
              phone: data.aggressor.phone || '',
              carPlate: data.aggressor.car_plate || '',
              description: data.aggressor.description || '',
              photo: data.aggressor.photo || null,
            });
            return;
          }
        }
      }
      
      // Fallback para localStorage se não tiver na BD
      const savedAggressor = await aggressorStorage.get();
      if (savedAggressor) {
        setAggressor(savedAggressor);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do agressor:', error);
      // Tenta carregar do localStorage em caso de erro
      try {
        const savedAggressor = await aggressorStorage.get();
        if (savedAggressor) {
          setAggressor(savedAggressor);
        }
      } catch (localError) {
        console.error('Erro ao carregar do localStorage:', localError);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAggressor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAggressor(prev => ({ ...prev, photo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAggressor(prev => ({ ...prev, photo: null }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const dataToSave = {
        name: aggressor.name.trim(),
        phone: aggressor.phone.trim(),
        carPlate: aggressor.carPlate.trim().toUpperCase(),
        description: aggressor.description.trim(),
        photo: aggressor.photo,
      };

      // Guardar na base de dados se tiver userId
      if (userId) {
        const response = await fetch(`${API_URL}/api/aggressor/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        });

        if (!response.ok) {
          throw new Error('Erro ao guardar na base de dados');
        }
        
        console.log('✅ Informações do agressor guardadas na BD');
      }

      // Também guardar no localStorage como backup
      await aggressorStorage.set(dataToSave);

      alert('Informações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar informações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja apagar todas as informações?')) {
      setLoading(true);
      
      try {
        // Apagar da base de dados se tiver userId
        if (userId) {
          await fetch(`${API_URL}/api/aggressor/${userId}`, {
            method: 'DELETE'
          });
          console.log('✅ Informações do agressor apagadas da BD');
        }

        // Também apagar do localStorage
        await aggressorStorage.delete();
        
        setAggressor({
          name: '',
          phone: '',
          carPlate: '',
          description: '',
          photo: null,
        });
        alert('Informações apagadas com sucesso!');
      } catch (error) {
        console.error('Erro ao apagar:', error);
        alert('Erro ao apagar informações.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="aggressor-container">
      <div className="aggressor-header" style={{position: 'relative', zIndex: 1}}>
        <button 
          className="btn-back" 
          onClick={() => navigate('/home')} 
          style={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            color: '#ffffff',
            backgroundColor: 'transparent',
            border: 'none'
          }}
        >
          ← Voltar
        </button>
        <h1 style={{textAlign: 'center', color: 'white', marginLeft: 0, marginRight: 0}}>Informações do Agressor</h1>
        <p className="subtitle" style={{textAlign: 'center', color: 'white'}}>Dados importantes para sua segurança</p>
      </div>

      <div className="aggressor-form">
        <div className="form-group">
          <label htmlFor="name">Nome Completo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={aggressor.name}
            onChange={handleInputChange}
            placeholder="Nome do agressor"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={aggressor.phone}
            onChange={handleInputChange}
            placeholder="+351 912 345 678"
          />
        </div>

        <div className="form-group">
          <label htmlFor="carPlate">Matrícula do Veículo</label>
          <input
            type="text"
            id="carPlate"
            name="carPlate"
            value={aggressor.carPlate}
            onChange={handleInputChange}
            placeholder="XX-00-XX"
            maxLength="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição Física</label>
          <textarea
            id="description"
            name="description"
            value={aggressor.description}
            onChange={handleInputChange}
            placeholder="Altura, cor dos olhos, sinais particulares, tatuagens..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Foto (Opcional)</label>
          {aggressor.photo ? (
            <div className="photo-preview">
              <img src={aggressor.photo} alt="Agressor" />
              <button className="photo-remove" onClick={handleRemovePhoto}>
                Remover
              </button>
            </div>
          ) : (
            <label className="photo-upload-btn" htmlFor="photo-upload">
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

        <div className="form-actions">
          <button className="btn-save" onClick={handleSave} disabled={loading}>
            {loading ? 'A guardar...' : 'Salvar Informações'}
          </button>
          {(aggressor.name || aggressor.phone || aggressor.photo) && (
            <button className="btn-delete" onClick={handleDelete} disabled={loading}>
              {loading ? 'A apagar...' : 'Apagar Todas as Informações'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AggressorInfo;
