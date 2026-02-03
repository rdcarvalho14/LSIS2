import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactsStorage } from '../../services/storage';
import './Network.css';

/**
 * Network - Tela 3: Rede de Apoio
 * Contatos de Confiança (máx 3)
 */
const Network = () => {
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedContacts = await contactsStorage.getAll();
      setContacts(savedContacts);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const formatPhone = (value) => {
    // Remove tudo exceto números e +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Se começar com +, mantém
    if (cleaned.startsWith('+')) {
      return cleaned.slice(0, 15); // Máx 15 dígitos internacionais
    }
    
    // Portugal: 9 dígitos (9XX XXX XXX)
    if (cleaned.length <= 9) {
      if (cleaned.length > 6) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1 $2 $3').trim();
      } else if (cleaned.length > 3) {
        return cleaned.replace(/(\d{3})(\d{0,3})/, '$1 $2').trim();
      }
    }
    
    return cleaned;
  };

  const handleAddContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      alert('Preencha nome e telefone');
      return;
    }

    if (contacts.length >= 3) {
      alert('Máximo de 3 contatos');
      return;
    }

    try {
      const id = await contactsStorage.add(newContact);
      setContacts([...contacts, { ...newContact, id }]);
      setNewContact({ name: '', phone: '', active: true });
      setShowAddContact(false);
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      alert('Erro ao adicionar contato');
    }
  };

  const handleToggleContact = async (contact) => {
    try {
      const updated = { ...contact, active: !contact.active };
      await contactsStorage.update(contact.id, { active: !contact.active });
      setContacts(contacts.map((c) => (c.id === contact.id ? updated : c)));
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      alert('Erro ao atualizar contato');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Remover este contato?')) {
      return;
    }

    try {
      await contactsStorage.delete(id);
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Erro ao remover contato:', error);
    }
  };

  return (
    <div className="network-container">
      <div className="network-header" style={{position: 'relative'}}>
        <button className="btn-back" onClick={() => navigate('/home')} style={{position: 'absolute', top: 0, left: 0}}>
          ← Voltar
        </button>
        <h1 style={{textAlign: 'center', color: '#FF4C4C', marginLeft: 0, marginRight: 0}}>Rede de Apoio</h1>
        <p className="network-subtitle" style={{textAlign: 'center'}}>Seus contatos de confiança</p>
      </div>

      {/* CONTATOS DE CONFIANÇA */}
      <section className="network-section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <div className="section-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#FF4C4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Contatos de Confiança</h2>
          </div>
          <p className="section-description">
            Conhecidos que receberam em contatos de confiança
          </p>
        </div>

        <div className="contacts-list">
          {contacts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👤</span>
              <p>Nenhum contato adicionado</p>
              <p className="empty-hint">Adicione pessoas de confiança</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`contact-card ${!contact.active ? 'inactive' : ''}`}
              >
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-phone">{contact.phone}</div>
                </div>

                <div className="contact-actions">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={contact.active}
                      onChange={() => handleToggleContact(contact)}
                    />
                    <span className="toggle-slider">
                      <span className="toggle-text">{contact.active ? 'ON' : 'OFF'}</span>
                    </span>
                  </label>

                  <button
                    className="btn-icon-delete"
                    onClick={() => handleDeleteContact(contact.id)}
                    aria-label="Remover contato"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="#A4B0BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {contacts.length < 3 && (
          <>
            {!showAddContact ? (
              <button className="btn-add-contact" onClick={() => setShowAddContact(true)}>
                + Adicionar Contato
              </button>
            ) : (
              <div className="add-contact-form">
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    placeholder="Nome do contato"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    placeholder="+351 912 345 678 ou 912 345 678"
                    value={newContact.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setNewContact({ ...newContact, phone: formatted });
                    }}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn-primary" onClick={handleAddContact}>
                    Adicionar
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setShowAddContact(false);
                      setNewContact({ name: '', phone: '', active: true });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {contacts.length >= 3 && (
          <div className="info-box">
            ℹ️ Limite de 3 contatos atingido. Remova um contato para adicionar outro.
          </div>
        )}
      </section>
    </div>
  );
};

export default Network;
