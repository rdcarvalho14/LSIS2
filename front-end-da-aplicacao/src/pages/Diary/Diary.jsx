import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiary } from '../../hooks/useDiary';
import './Diary.css';

/**
 * Diary - Tela 2: Diário Seguro
 * - Lista de entradas criptografadas
 * - IMUTÁVEL: sem editar ou apagar
 * - Adicionar nova entrada com texto, foto e áudio
 */
const Diary = () => {
  const navigate = useNavigate();
  const { entries, addEntry, loading } = useDiary();
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleAddEntry = async () => {
    if (!text.trim()) {
      alert('Digite algo no diário');
      return;
    }

    setSaving(true);
    try {
      await addEntry({
        text: text.trim(),
        photos: photos,
        hasPhoto: photos.length > 0,
      });
      
      setText('');
      setPhotos([]);
      setShowModal(false);
    } catch (error) {
      alert('Erro ao salvar entrada');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setPhotos([...photos, ...results]);
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="diary-container">
        <div className="diary-loading">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="diary-container">
      <div className="diary-header" style={{position: 'relative', zIndex: 1}}>
        <button 
          className="btn-back" 
          onClick={() => navigate('/home')} 
          style={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            color: '#ffffff !important',
            backgroundColor: 'transparent',
            border: 'none'
          }}
        >
          ← Voltar
        </button>
        <h1 style={{textAlign: 'center', color: 'white', marginLeft: 0, marginRight: 0}}>Diário Seguro</h1>
        <p className="diary-subtitle" style={{textAlign: 'center', color: 'white'}}>Suas informações ficam criptografadas</p>
      </div>

      {entries.length === 0 ? (
        <div className="diary-empty">
          <span className="empty-icon">📝</span>
          <p>Nenhuma entrada ainda</p>
          <p className="empty-hint">Comece registrando suas experiências</p>
        </div>
      ) : (
        <div className="diary-list">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="diary-entry entry-preview"
              onClick={() => setShowDetail(entry)}
            >
              <div className="entry-header">
                <span className="entry-date">{formatDate(entry.timestamp)}</span>
                <span className="entry-time">{formatTime(entry.timestamp)}</span>
              </div>
              <div className="entry-text entry-preview">
                {(entry.text || 'Entrada criptografada').substring(0, 100)}
                {(entry.text || '').length > 100 && '...'}
              </div>
              {entry.hasPhoto && (
                <div className="entry-badge">📷 Foto</div>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="fab" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Entrada</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <textarea
                className="diary-textarea"
                placeholder="Escreva aqui..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                rows={8}
              />

              {photos.length > 0 && (
                <div className="photos-preview">
                  {photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo} alt={`Foto ${index + 1}`} />
                      <button
                        className="photo-remove"
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-actions">
                <label className="btn-action">
                  📷 Foto
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-save"
                onClick={handleAddEntry}
                disabled={!text.trim() || saving}
              >
                {saving ? (
                  <>
                    <span className="spinner spinner-sm"></span>
                    <span>Salvando...</span>
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal-content modal-detail" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="detail-date">{formatDate(showDetail.timestamp)}</div>
                <div className="detail-time">{formatTime(showDetail.timestamp)}</div>
              </div>
              <button className="modal-close" onClick={() => setShowDetail(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-text">
                {showDetail.text || 'Entrada criptografada'}
              </div>

              {showDetail.photos && showDetail.photos.length > 0 && (
                <div className="detail-photos">
                  {showDetail.photos.map((photo, index) => (
                    <img key={index} src={photo} alt={`Foto ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diary;
