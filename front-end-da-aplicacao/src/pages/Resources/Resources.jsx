import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Resources.css';

/**
 * Resources - Tela 4: Recursos e Ajuda
 * Lista de artigos educativos sobre violência doméstica
 */

const ARTICLES = [
  {
    id: 1,
    title: 'O que é a Violência Doméstica?',
    subtitle: 'Não é só física. Conheça os sinais e o ciclo.',
    icon: '',
    sections: [
      {
        type: 'types',
        title: 'Tipos de Violência',
        items: [
          {
            icon: '👊',
            title: 'Violência Física',
            description: 'Empurrar, bater, estrangular, usar armas ou qualquer ato que cause dano físico.'
          },
          {
            icon: '🧠',
            title: 'Violência Psicológica',
            description: 'Humilhação, intimidação, isolamento de amigos/família, controle financeiro, ameaças constantes.'
          },
          {
            icon: '�',
            title: 'Violência Sexual',
            description: 'Qualquer ato sexual forçado ou manipulação relacionada à reprodução.'
          },
          {
            icon: '💰',
            title: 'Violência Económica',
            description: 'Controle de recursos económicos, impedimento de trabalhar ou estudar.'
          }
        ]
      },
      {
        type: 'cycle',
        title: 'Ciclo da Violência',
        items: [
          '① Tensão crescente',
          '② Explosão violenta',
          '③ Lua de mel (pedidos de desculpa, promessas)',
          '④ Período de calma (temporário)'
        ]
      },
      {
        type: 'alert',
        text: 'IMPORTANTE: A violência doméstica NÃO é culpa da vítima. Ninguém merece ser maltratado, independentemente das circunstâncias.'
      }
    ]
  },
  {
    id: 2,
    title: 'Seus Direitos: Leis em Portugal',
    subtitle: 'A denúncia não depende da vontade da vítima. Qualquer pessoa pode denunciar.',
    icon: '',
    sections: [
      {
        type: 'highlight',
        title: 'Violência Doméstica é Crime Público',
        text: 'Em Portugal, a violência doméstica é CRIME PÚBLICO desde 2000. As autoridades podem agir mesmo sem queixa formal!'
      },
      {
        type: 'rights',
        title: 'Conheça os Seus Direitos',
        items: [
          {
            icon: '🛡️',
            title: 'Proteção Policial',
            description: 'Direito a medidas de proteção e afastamento do agressor.'
          },
          {
            icon: '⚖️',
            title: 'Apoio Jurídico',
            description: 'Acesso a advogado e isenção de custas judiciais.'
          },
          {
            icon: '🧠',
            title: 'Apoio Psicológico',
            description: 'Acompanhamento especializado gratuito.'
          },
          {
            icon: '💼',
            title: 'Direitos Laborais',
            description: 'Faltas justificadas, transferência ou teletrabalho.'
          }
        ]
      },
      {
        type: 'complaint-steps',
        title: 'Como Fazer Queixa',
        steps: [
          {
            number: 1,
            icon: '',
            text: 'Dirija-se à PSP, GNR ou Ministério Público.'
          },
          {
            number: 2,
            icon: '',
            text: 'Pode ser acompanhada por pessoa de confiança.'
          },
          {
            number: 3,
            icon: '',
            text: 'Relate os factos, apresente provas e testemunhas.'
          },
          {
            number: 4,
            icon: '',
            text: 'Assine o auto de denúncia e peça cópia.'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Criando um Plano de Saída Seguro',
    icon: '📋',
    sections: [
      {
        type: 'alert',
        text: '💡 Um plano de saída bem preparado pode salvar sua vida!'
      },
      {
        type: 'checklist',
        title: '📦 Antes de Sair: Prepare uma Mala',
        categories: [
          {
            icon: '📄',
            title: 'Documentos Essenciais',
            note: '(Guarde em local seguro ou com pessoa de confiança)',
            items: [
              'Cartão de cidadão / passaporte',
              'Certidões de nascimento (suas e dos filhos)',
              'Documentos de saúde',
              'Comprovantes de rendimentos',
              'Registos de propriedade',
              'Senhas e códigos importantes'
            ]
          },
          {
            icon: '🎒',
            title: 'Itens de Emergência',
            items: [
              'Dinheiro (notas e moedas)',
              'Cartão multibanco',
              'Chaves sobressalentes (casa, carro)',
              'Medicamentos essenciais',
              'Óculos/lentes de contacto',
              'Roupa para 2-3 dias'
            ]
          },
          {
            icon: '🧸',
            title: 'Para as Crianças',
            items: [
              'Brinquedos favoritos',
              'Cadernos escolares',
              'Roupa e fraldas (se aplicável)'
            ]
          }
        ]
      },
      {
        type: 'action-plan',
        title: '🎯 Plano de Ação',
        steps: [
          {
            icon: '🗺️',
            title: 'Identifique Rotas de Fuga',
            items: [
              'Conheça todas as saídas da casa',
              'Mantenha chaves acessíveis',
              'Saiba onde estacionar o carro'
            ]
          },
          {
            icon: '🔑',
            title: 'Código de Emergência',
            items: [
              'Estabeleça palavra-código com amigos/família',
              'Use para pedir ajuda discretamente'
            ]
          },
          {
            icon: '🏠',
            title: 'Local Seguro',
            items: [
              'Identifique onde irá (amigo, familiar, abrigo)',
              'Tenha endereço e contacto anotados',
              'Avise pessoa de confiança do seu plano'
            ]
          },
          {
            icon: '⏰',
            title: 'No Momento da Saída',
            items: [
              'Escolha momento em que está sozinha',
              'Leve apenas o essencial',
              'NÃO avise o agressor',
              'Vá direto ao local seguro'
            ]
          },
          {
            icon: '✅',
            title: 'Depois de Sair',
            items: [
              'Faça queixa à polícia',
              'Solicite ordem de proteção',
              'Mude passwords e PINs',
              'Informe escola/trabalho',
              'Bloqueie acesso às redes sociais'
            ]
          }
        ]
      },
      {
        type: 'highlight',
        text: '❤️ Lembre-se: Sua segurança e dos seus filhos é prioritária. Não há vergonha em pedir ajuda!'
      }
    ]
  },
  {
    id: 4,
    title: 'Autodefesa: O Que Fazer em Emergência',
    icon: '',
    sections: [
      
     
      {
        type: 'awareness-tips',
        title: 'Mantenha-se Consciente',
        items: [
          { icon: '👀', text: 'Observe quem está à sua volta', color: 'blue' },
          { icon: '🚶‍♀️', text: 'Se sentir desconforto, afaste-se', color: 'green' },
          { icon: '🔇', text: 'Evite distrações em locais isolados', color: 'orange' }
        ]
      },
      {
        type: 'body-targets',
        title: 'Pontos Sensíveis do Corpo',
        subtitle: 'Alvos que causam dor intensa e dão tempo para fugir',
        items: [
          { 
            bodyPart: 'Olhos', 
            icon: '👁️', 
            action: 'Enfie os dedos ou esfregue com força',
            color: '#EF4444'
          },
          { 
            bodyPart: 'Nariz', 
            icon: '👃', 
            action: 'Golpe para cima com a base da palma',
            color: '#F97316'
          },
          { 
            bodyPart: 'Garganta', 
            icon: '🗣️', 
            action: 'Soco ou golpe lateral rápido',
            color: '#EAB308'
          },
          { 
            bodyPart: 'Joelhos', 
            icon: '🦵', 
            action: 'Chute na lateral para desequilibrar',
            color: '#22C55E'
          },
          { 
            bodyPart: 'Zona íntima', 
            icon: '⚡', 
            action: 'Joelhada ou chute forte',
            color: '#8B5CF6'
          }
        ]
      },
      {
        type: 'techniques',
        title: 'Como Se Libertar de Agarrões',
        scenarios: [
          {
            situation: 'Agarrada pelos Pulsos',
            icon: '',
            steps: [
              '1. Rode o punho na direção do polegar dele (é o ponto mais fraco)',
              '2. Puxe com toda a força',
              '3. Afaste-se e corra para onde há pessoas'
            ]
          },
          {
            situation: 'Agarrada pelo Pescoço (de frente)',
            icon: '',
            steps: [
              '1. Levante os braços entre os dele rapidamente',
              '2. Empurre os braços dele para os lados',
              '3. Joelhada forte nos genitais',
              '4. Fuja imediatamente'
            ]
          },
          {
            situation: 'Empurrada Contra a Parede',
            icon: '',
            steps: [
              '1. Use os cotovelos para empurrar e criar espaço',
              '2. Pisão forte no peito do pé dele',
              '3. Empurre e corra sem olhar para trás'
            ]
          }
        ]
      },
      {
        type: 'defense-items',
        title: 'Use o Que Tem à Mão',
        intro: 'Qualquer objeto pode virar uma ferramenta de defesa. Não precisa de armas especiais:',
        items: [
          { icon: '', text: 'Chaves → Segure entre os dedos, use para arranhar ou atingir o rosto' },
          { icon: '', text: 'Spray/Desodorante → Aponte para os olhos e fuja' },
          { icon: '', text: 'Guarda-chuva → Use como bastão para manter distância' },
          { icon: '', text: 'Mala/Mochila → Gire e use para bloquear ou criar espaço' }
        ]
      },
      {
        type: 'scream',
        title: 'A Sua Voz Salva Vidas',
        tips: [
          'Grite "FOGO!" em vez de "Ajuda!" — as pessoas prestam mais atenção',
          'Faça o máximo de barulho possível para atrair testemunhas',
          'Corra em direção a lojas, restaurantes, qualquer lugar com gente',
          'Se conseguir, ligue 112 mesmo durante a fuga'
        ]
      },
      {
        type: 'important-rules',
        title: 'Regras de Ouro',
        rules: [
          'Use força APENAS o suficiente para conseguir fugir',
          'O seu objetivo é ESCAPAR, não ganhar uma luta',
          'Procure treino presencial de autodefesa quando puder',
          'Estas técnicas são para ÚLTIMA INSTÂNCIA — fuja sempre que possível'
        ]
      },
      {
        type: 'after-defense',
        title: 'Depois de Conseguir Escapar',
        steps: [
          'Fuja para um local público e movimentado',
          'Ligue 112 imediatamente',
          'Procure testemunhas e peça ajuda',
          'Se ferida, vá ao hospital',
          'Faça queixa — você pode ajudar a evitar outras vítimas'
        ]
      },
      {
        type: 'highlight',
        text: 'Lembre-se: A sua vida vale mais do que qualquer confronto. Se puder evitar, fuja. Se não puder, lute com tudo o que tem e escape assim que conseguir.'
      }
    ]
  },
  {
    id: 5,
    title: 'Onde Buscar Ajuda Presencial',
    icon: '📍',
    sections: [
      {
        type: 'contacts',
        title: '📞 Linhas Telefónicas (24h)',
        items: [
          { number: '112', label: 'Emergências (polícia, bombeiros, INEM)' },
          { number: '116 006', label: 'Linha de Apoio à Vítima (gratuita, 24h)' },
          { number: '144', label: 'Linha Nacional de Emergência Social' },
          { number: '707 200 077', label: 'APAV - Apoio à Vítima' }
        ]
      },
      {
        type: 'help-locations',
        title: '🏢 Locais de Apoio em Portugal',
        places: [
          {
            icon: '💚',
            name: 'APAV - Gabinetes de Apoio',
            description: 'Presentes em todo o país',
            services: ['Apoio psicológico', 'Apoio jurídico', 'Apoio social', 'Acompanhamento ao tribunal'],
            locations: ['Lisboa: Rua José Estêvão, 135-A', 'Porto: Rua Augusto Rosa, 29', '(Consulte website para outros locais)']
          },
          {
            icon: '🏠',
            name: 'Casas de Abrigo',
            description: 'Acolhimento temporário seguro',
            services: ['Localização confidencial', 'Apoio 24h', 'Alojamento, alimentação', 'Apoio psicológico e jurídico', 'Ajuda na reintegração'],
            contact: 'Através da Linha 144 ou Segurança Social'
          },
          {
            icon: '🏥',
            name: 'Centros de Saúde',
            services: ['Atendimento médico', 'Apoio psicológico', 'Emissão de certificados médicos', 'Encaminhamento para serviços especializados']
          },
          {
            icon: '👮',
            name: 'Esquadras PSP / Postos GNR',
            description: 'Disponível 24h',
            services: ['Fazer queixa', 'Solicitar ordem de proteção', 'Pedir acompanhamento']
          },
          {
            icon: '👶',
            name: 'CPCJ - Proteção de Crianças e Jovens',
            description: 'Se tem filhos',
            services: ['Proteção das crianças', 'Acompanhamento familiar', 'Apoio social']
          },
          {
            icon: '⚖️',
            name: 'Tribunais',
            services: ['Secções de Família e Menores', 'Juízos de Violência Doméstica', 'Advogado oficioso (gratuito)']
          },
          {
            icon: '🤝',
            name: 'Segurança Social',
            services: ['Rendimento Social de Inserção', 'Subsídios de apoio', 'Apoio habitacional temporário']
          }
        ]
      },
      {
        type: 'organizations',
        title: '🌐 Organizações Especializadas',
        orgs: [
          { name: 'UMAR', fullName: 'União de Mulheres Alternativa e Resposta', phone: '218 873 005' },
          { name: 'CIG', fullName: 'Comissão para a Cidadania e Igualdade de Género', phone: '217 983 000' }
        ]
      },
      {
        type: 'online-services',
        title: '💻 Serviços Online',
        services: [
          '🌐 Portal da Queixa Eletrónica (PSP/GNR)',
          '💬 Chat online da APAV',
          '📧 Email: apav.sede@apav.pt'
        ]
      },
      {
        type: 'documents-needed',
        title: '📋 Documentos para Levar',
        items: [
          '🆔 Identificação pessoal',
          '👶 Documentos dos filhos',
          '🏠 Comprovativo de morada',
          '🏥 Relatórios médicos (se tiver)',
          '📸 Fotos de lesões',
          '📱 Mensagens/emails ameaçadores'
        ]
      },
      {
        type: 'highlight',
        text: '💪 Lembre-se: Não está sozinha. Há uma rede inteira pronta para ajudar. O primeiro passo é o mais difícil, mas é o início da sua liberdade!'
      }
    ]
  },
];

// Componente para renderizar conteúdo estruturado
const ArticleContent = ({ article }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Se usa formato antigo (content string)
  if (article.content) {
    return <div className="article-text">{article.content}</div>;
  }

  // Artigos 4 e 5 usam formato FAQ
  const useFaqFormat = article.id === 4 || article.id === 5;

  // Se usa formato FAQ (apenas para artigos 4 e 5)
  if (useFaqFormat) {
    return (
      <div className="article-sections faq-style">
        {article.sections.map((section, idx) => {
          const isExpanded = expandedSections[idx];
          const sectionTitle = section.title || section.text || '';
          
          // Para seções sem título específico (como alerts, highlights), renderizar diretamente
          if (section.type === 'alert' || (section.type === 'highlight' && !section.title)) {
            return (
              <div key={idx} className={`section-${section.type} faq-always-visible`}>
                <p>{section.text}</p>
              </div>
            );
          }

          return (
            <div key={idx} className="faq-item">
              <button 
                className="faq-question"
                onClick={() => toggleSection(idx)}
                aria-expanded={isExpanded}
              >
                <h3>{sectionTitle}</h3>
                <span className="faq-icon">{isExpanded ? '−' : '+'}</span>
              </button>
              
              {isExpanded && (
                <div className="faq-answer">
                  {renderSectionContent(section)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Formato normal para artigos 1, 2, 3 (e outros)
  return (
    <div className="article-sections">
      {article.sections.map((section, idx) => (
        <div key={idx} className={`article-section section-${section.type}`}>
          {section.title && <h3>{section.title}</h3>}
          {renderSectionContent(section)}
        </div>
      ))}
    </div>
  );
};

// Função auxiliar para renderizar conteúdo de cada secção
const renderSectionContent = (section) => {
  switch (section.type) {
    case 'intro':
      return (
        <div className="section-intro">
          <p>{section.text}</p>
        </div>
      );

    case 'highlight':
      return (
        <div className="section-highlight">
          <p>{section.text}</p>
        </div>
      );

    case 'law':
      return (
        <div className="section-law">
          <p>{section.text}</p>
        </div>
      );

    case 'types':
      return (
        <div className="section-types">
          <div className="types-grid">
            {section.items.map((item, i) => (
              <div key={i} className="type-card">
                <div className="type-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'rights':
      return (
        <div className="section-rights">
          <div className="rights-grid">
            {section.items.map((item, i) => (
              <div key={i} className="right-card">
                <div className="right-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'complaint-steps':
      return (
        <div className="section-complaint">
          <div className="complaint-timeline">
            {section.steps.map((step, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-number">{step.number}</div>
                <div className="timeline-content">
                  <div className="timeline-icon">{step.icon}</div>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'contacts':
      return (
        <div className="section-contacts">
          <div className="contacts-grid">
            {section.items.map((item, i) => (
              <a key={i} href={`tel:${item.number.replace(/\s/g, '')}`} className="emergency-contact-card">
                <div className="contact-number">{item.number}</div>
                <div className="contact-label">{item.label}</div>
              </a>
            ))}
          </div>
        </div>
      );

    case 'steps':
      return (
        <div className="section-steps">
          <div className="steps-list">
            {section.steps.map((step, i) => (
              <div key={i} className="step-item">
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cycle':
      return (
        <div className="section-cycle">
          <div className="cycle-container">
            <div className="cycle-visual">
              <div className="cycle-phase phase-1">
                <div className="phase-number">1</div>
                <div className="phase-content">
                  <h4>Tensão</h4>
                  <p>Irritação crescente, discussões frequentes, ambiente tenso</p>
                </div>
              </div>
              
              <div className="phase-arrow arrow-1">→</div>
              
              <div className="cycle-phase phase-2">
                <div className="phase-number">2</div>
                <div className="phase-content">
                  <h4>Explosão</h4>
                  <p>Violência física, psicológica ou sexual acontece</p>
                </div>
              </div>
              
              <div className="phase-arrow arrow-2">↓</div>
              
              <div className="cycle-phase phase-3">
                <div className="phase-number">3</div>
                <div className="phase-content">
                  <h4>Lua de Mel</h4>
                  <p>Pedidos de desculpa, promessas, presentes, carinho</p>
                </div>
              </div>
              
              <div className="phase-arrow arrow-3">←</div>
              
              <div className="cycle-phase phase-4">
                <div className="phase-number">4</div>
                <div className="phase-content">
                  <h4>Calma</h4>
                  <p>Período temporário de paz (cada vez mais curto)</p>
                </div>
              </div>
              
              <div className="phase-arrow arrow-4">↑</div>
            </div>
            
            <div className="cycle-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-text">
                <strong>Este ciclo repete-se indefinidamente</strong>
                <p>Com o tempo, as fases de calma tornam-se cada vez mais curtas e a violência mais intensa. Romper este ciclo requer ajuda profissional.</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'alert':
      return (
        <div className="section-alert">
          <p>{section.text}</p>
        </div>
      );

    case 'checklist':
      return (
        <div className="section-checklist">
          {section.categories.map((cat, i) => (
            <div key={i} className="checklist-category">
              <h4>
                {cat.icon} {cat.title}
              </h4>
              {cat.note && <p className="checklist-note">{cat.note}</p>}
              <ul className="checklist-items">
                {cat.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case 'action-plan':
      return (
        <div className="section-action-plan">
          {section.steps.map((step, i) => (
            <div key={i} className="action-step">
              <h4>
                {step.icon} {step.title}
              </h4>
              <ul>
                {step.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case 'defense-tips':
      return (
        <div className="section-defense-tips">
          {section.items.map((item, i) => (
            <div key={i} className="defense-tip">
              <div className="tip-icon">{item.icon}</div>
              <div className="tip-content">
                <h4>{item.title}</h4>
                <ul>
                  {item.tips.map((tip, j) => (
                    <li key={j}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      );

    case 'awareness-tips':
      return (
        <div className="section-awareness-tips">
          <div className="awareness-grid">
            {section.items.map((item, i) => (
              <div key={i} className={`awareness-card awareness-${item.color}`}>
                <span className="awareness-icon">{item.icon}</span>
                <span className="awareness-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'body-targets':
      return (
        <div className="section-body-targets">
          {section.subtitle && <p className="body-targets-subtitle">{section.subtitle}</p>}
          <div className="body-targets-grid">
            {section.items.map((item, i) => (
              <div 
                key={i} 
                className="body-target-card"
                style={{ '--target-color': item.color }}
              >
                <div className="target-header">
                  <span className="target-icon">{item.icon}</span>
                  <span className="target-part">{item.bodyPart}</span>
                </div>
                <div className="target-action">
                  <span className="action-arrow">→</span>
                  <span>{item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'techniques':
      return (
        <div className="section-techniques">
          {section.scenarios.map((scenario, i) => (
            <div key={i} className="technique-card">
              <div className="technique-icon">{scenario.icon}</div>
              <h4>{scenario.situation}</h4>
              <ol className="technique-steps">
                {scenario.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      );

    case 'defense-items':
      return (
        <div className="section-defense-items">
          {section.intro && <p className="items-intro">{section.intro}</p>}
          <div className="defense-items-grid">
            {section.items.map((item, i) => (
              <div key={i} className="defense-item">
                <span className="item-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'scream':
      return (
        <div className="section-scream">
          <ul className="scream-tips">
            {section.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      );

    case 'important-rules':
      return (
        <div className="section-rules">
          <ul className="rules-list">
            {section.rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>
      );

    case 'after-defense':
      return (
        <div className="section-after-defense">
          <ol className="after-defense-steps">
            {section.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      );

    case 'help-locations':
      return (
        <div className="section-help-locations">
          {section.places.map((place, i) => (
            <div key={i} className="help-location-card">
              <h4>
                {place.icon} {place.name}
              </h4>
              <p className="location-description">{place.description}</p>
              <div className="location-services">
                <strong>Serviços:</strong>
                <ul>
                  {place.services.map((service, j) => (
                    <li key={j}>{service}</li>
                  ))}
                </ul>
              </div>
              {place.locations && (
                <div className="location-addresses">
                  <strong>Localizações:</strong>
                  <ul>
                    {place.locations.map((loc, j) => (
                      <li key={j}>{loc}</li>
                    ))}
                  </ul>
                </div>
              )}
              {place.contact && (
                <p className="location-contact">
                  <strong>Contacto:</strong> {place.contact}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case 'institutions':
      return (
        <div className="section-institutions">
          {section.items.map((item, i) => (
            <div key={i} className="institution-card">
              <h4>
                {item.icon} {item.name}
              </h4>
              <ul>
                {item.services.map((service, j) => (
                  <li key={j}>{service}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case 'organizations':
      return (
        <div className="section-organizations">
          {section.orgs.map((org, i) => (
            <div key={i} className="org-card">
              <h4>{org.name}</h4>
              <p>{org.fullName}</p>
              <a href={`tel:${org.phone.replace(/\s/g, '')}`} className="org-phone">
                {org.phone}
              </a>
            </div>
          ))}
        </div>
      );

    case 'online-services':
      return (
        <div className="section-online-services">
          <ul className="online-services-list">
            {section.services.map((service, i) => (
              <li key={i}>{service}</li>
            ))}
          </ul>
        </div>
      );

    case 'documents-needed':
      return (
        <div className="section-documents">
          <div className="documents-grid">
            {section.items.map((item, i) => (
              <div key={i} className="document-item">{item}</div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

const Resources = () => {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="resources-container">
      {!selectedArticle ? (
        // LISTA DE ARTIGOS
        <>
          <div className="resources-header">
            <button className="btn-back-ghost" onClick={() => navigate('/home')}>
              ← Voltar
            </button>
            <h1>Recursos e Ajuda</h1>
            <p className="resources-subtitle">Informação que pode salvar vidas</p>
          </div>

          <div className="articles-list">
            {ARTICLES.map((article) => {
              // Artigo 3 é o Plano de Saída - navega para checklist
              if (article.id === 3) {
                return (
                  <button
                    key={article.id}
                    className="article-card safety-plan-card"
                    onClick={() => navigate('/safety-plan')}
                  >
                    <div className="article-content">
                      <h3>Plano de Saída Seguro</h3>
                    </div>
                  </button>
                );
              }
              
              return (
                <button
                  key={article.id}
                  className={`article-card ${article.id === 5 ? 'full-width' : ''}`}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="article-content">
                    <h3>{article.title}</h3>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        // VISUALIZAÇÃO DO ARTIGO
        <div className="article-view">
          <div className="article-view-header">
            <button className="btn-back-ghost" onClick={() => setSelectedArticle(null)}>
              <span>← Voltar</span>
            </button>
          </div>

          <div className="article-view-content">
            <div className="article-view-icon">{selectedArticle.icon}</div>
            <h1>{selectedArticle.title}</h1>
            {selectedArticle.subtitle && <p className="article-subtitle">{selectedArticle.subtitle}</p>}
            <ArticleContent article={selectedArticle} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
