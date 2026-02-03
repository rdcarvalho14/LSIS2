import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsStorage } from '../../services/storage';
import './SafetyPlan.css';

/**
 * SafetyPlan - Plano de Saída Seguro
 * Checklist interativo com progresso em porcentagem
 */

const SafetyPlan = () => {
  const navigate = useNavigate();
  
  const checklistItems = [
    {
      id: 1,
      category: 'Documentos Essenciais (URGENTE)',
      items: [
        'Documentos de Identidade (BI/CC)',
        'Certidões de Nascimento dos filhos (se aplicável)',
        'Cartões de Saúde e Medicamentos',
        'Documentos Financeiros (Cartão Multibanco)'
      ]
    },
    {
      id: 2,
      category: 'Finanças e Acesso a Dinheiro',
      items: [
        'Separar dinheiro em local seguro',
        'Abrir conta bancária própria',
        'Guardar códigos PIN em local seguro'
      ]
    },
    {
      id: 3,
      category: 'Preparação da Saída',
      items: [
        'Identificar lugar seguro para ir',
        'Ter chaves extras do carro/casa',
        'Mala de emergência preparada',
        'Contactar abrigo ou centro de apoio'
      ]
    },
    {
      id: 4,
      category: 'Contactos e Comunicação',
      items: [
        'Memorizar número de emergência (116 006)',
        'Lista de contactos de confiança',
        'Cartão telefónico pré-pago guardado'
      ]
    },
    {
      id: 5,
      category: 'Segurança Digital',
      items: [
        'Alterar senhas importantes',
        'Desativar localização do telemóvel',
        'Apagar histórico de navegação'
      ]
    }
  ];

  const [checkedItems, setCheckedItems] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadChecklist();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [checkedItems]);

  const loadChecklist = async () => {
    try {
      const saved = await settingsStorage.get('safetyPlan_checklist');
      if (saved) {
        setCheckedItems(saved);
      }
    } catch (error) {
      console.error('Erro ao carregar checklist:', error);
    }
  };

  const calculateProgress = () => {
    const totalItems = checklistItems.reduce((sum, cat) => sum + cat.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const percentage = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
    setProgress(percentage);
  };

  const handleCheck = async (categoryId, itemIndex) => {
    const key = `${categoryId}-${itemIndex}`;
    const newCheckedItems = {
      ...checkedItems,
      [key]: !checkedItems[key]
    };
    
    setCheckedItems(newCheckedItems);
    
    try {
      await settingsStorage.set('safetyPlan_checklist', newCheckedItems);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const isChecked = (categoryId, itemIndex) => {
    const key = `${categoryId}-${itemIndex}`;
    return checkedItems[key] || false;
  };

  return (
    <div className="safety-plan-container">
      <div className="safety-plan-header">
        <button 
          className="btn-back-white" 
          onClick={() => navigate('/resources')}
        >
          ← Voltar
        </button>
        <h1>Plano de Saída Seguro</h1>
        <p className="subtitle">Marque cada item conforme você avança</p>
      </div>

      {/* Barra de Progresso */}
      <div className="progress-card">
        <div className="progress-info">
          <span className="progress-label">Seu Progresso</span>
          <span className="progress-percentage">{progress}% concluído</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist por Categoria */}
      <div className="checklist-sections">
        {checklistItems.map((category) => (
          <div key={category.id} className="category-section">
            <h2 className="category-title">{category.category}</h2>
            
            <div className="checklist-items">
              {category.items.map((item, index) => {
                const checked = isChecked(category.id, index);
                return (
                  <div 
                    key={index} 
                    className={`checklist-item ${checked ? 'checked' : ''}`}
                    onClick={() => handleCheck(category.id, index)}
                  >
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom">
                        {checked && '✓'}
                      </span>
                    </div>
                    <span className="item-text">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem de Conclusão */}
      {progress === 100 && (
        <div className="completion-message">
          <span className="completion-icon">🎉</span>
          <h3>Parabéns!</h3>
          <p>Você completou todos os itens do plano de saída seguro.</p>
        </div>
      )}
    </div>
  );
};

export default SafetyPlan;
