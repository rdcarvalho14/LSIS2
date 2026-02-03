import React, { useState, useEffect } from "react";
import { formatTime } from "./utils";

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

export default function VictimDetailsModal({ userId, victimName, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (userId) {
      loadDetails();
    }
  }, [userId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/victim-details/${userId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Dados não encontrados para esta vítima.');
        } else {
          throw new Error('Erro ao carregar dados');
        }
        return;
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      setError('Erro ao carregar informações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  };

  const modalContentStyle = {
    background: '#fff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 800,
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '24px 32px',
    borderRadius: '20px 20px 0 0',
  };

  const sectionStyle = {
    padding: '24px 32px',
    borderBottom: '1px solid #e5e7eb',
  };

  const labelStyle = {
    fontSize: 13,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  };

  const valueStyle = {
    fontSize: 17,
    color: '#111827',
    fontWeight: 500,
  };

  const InfoRow = ({ label, value }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value || 'Não disponível'}</div>
    </div>
  );

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                Ficha da Vítima
              </h2>
              <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: 15 }}>
                Informações completas sobre a vítima e agressor
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 12,
                padding: '12px 20px',
                color: '#fff',
                fontSize: 16,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ✕ Fechar
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#666' }}>🔄 A carregar informações...</div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div style={{ fontSize: 18, color: '#666' }}>{error}</div>
          </div>
        )}

        {/* Content */}
        {data && !loading && (
          <>
            {/* Dados da Vítima */}
            <div style={sectionStyle}>
              <h3 style={{ margin: '0 0 20px', fontSize: 20, color: '#111827', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>👤</span> Dados da Vítima
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: data.victim?.photo ? '1fr 200px' : '1fr', gap: 32 }}>
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                    <InfoRow label="Nome" value={data.victim?.nome} />
                    <InfoRow label="Telefone" value={data.victim?.telefone} />
                    <InfoRow label="Email" value={data.victim?.email} />
                    <InfoRow label="Morada" value={data.victim?.morada} />
                    <InfoRow label="Registada desde" value={formatTime(data.victim?.created_at)} />
                  </div>
                </div>
                
                {/* Foto da Vítima */}
                {data.victim?.photo && (
                  <div>
                    <div style={labelStyle}>Foto da Vítima</div>
                    <div style={{
                      border: '3px solid #667eea',
                      borderRadius: 16,
                      overflow: 'hidden',
                      background: '#eef2ff',
                    }}>
                      <img
                        src={data.victim.photo}
                        alt="Foto da Vítima"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dados do Agressor */}
            <div style={sectionStyle}>
              <h3 style={{ margin: '0 0 20px', fontSize: 20, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>⚠️</span> Dados do Agressor
              </h3>
              
              {data.aggressor ? (
                <div style={{ display: 'grid', gridTemplateColumns: data.aggressor.photo ? '1fr 200px' : '1fr', gap: 32 }}>
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                      <InfoRow label="Nome" value={data.aggressor.name} />
                      <InfoRow label="Telefone" value={data.aggressor.phone} />
                      <InfoRow label="Matrícula do Veículo" value={data.aggressor.carPlate} />
                    </div>
                    
                    {data.aggressor.description && (
                      <div style={{ marginTop: 8 }}>
                        <div style={labelStyle}>Descrição Física</div>
                        <div style={{
                          ...valueStyle,
                          background: '#fef3c7',
                          padding: 16,
                          borderRadius: 12,
                          border: '1px solid #fbbf24',
                          lineHeight: 1.6,
                        }}>
                          {data.aggressor.description}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Foto do Agressor */}
                  {data.aggressor.photo && (
                    <div>
                      <div style={labelStyle}>Foto do Agressor</div>
                      <div style={{
                        border: '3px solid #dc2626',
                        borderRadius: 16,
                        overflow: 'hidden',
                        background: '#fee2e2',
                      }}>
                        <img
                          src={data.aggressor.photo}
                          alt="Foto do Agressor"
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  padding: 32,
                  textAlign: 'center',
                  background: '#f3f4f6',
                  borderRadius: 12,
                  color: '#6b7280',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                  <div style={{ fontSize: 16 }}>
                    A vítima ainda não registou informações sobre o agressor.
                  </div>
                </div>
              )}
            </div>

            {/* Footer com aviso */}
            <div style={{ padding: '20px 32px', background: '#fef3c7', borderRadius: '0 0 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>🔒</span>
                <span style={{ fontSize: 14, color: '#92400e' }}>
                  <strong>Informação confidencial.</strong> Estes dados são protegidos e devem ser usados apenas para fins de proteção da vítima.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
