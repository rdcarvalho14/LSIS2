import { useContext, useEffect, useRef, useState } from 'react';
import './Chat.css';
import { chatAPI, CONNECTION_STATUS } from '../../services/chatAPI';
import { PANIC_WORD } from '../../utils/constants';
import { EmergencyContext } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const listRef = useRef(null);
  const { triggerSilentAlert } = useContext(EmergencyContext);

  const quickSuggestions = [
    'Estou com medo',
    'Preciso de ajuda para sair',
    'Como fazer queixa?',
    'Estou em perigo',
    'Preciso falar sobre o que aconteceu',
  ];

  useEffect(() => {
    // Auto conectar ao abrir a tela (mock)
    let mounted = true;
    (async () => {
      try {
        setStatus(CONNECTION_STATUS.CONNECTING);
        await chatAPI.connect('current-user');
        if (!mounted) return;
        setStatus(CONNECTION_STATUS.CONNECTED);
        setMessages([{
          id: 'welcome',
          sender: 'assistant',
          text: `Olá! Bem-vinda a este espaço seguro e confidencial. 

Eu sou uma assistente especializada em apoio a vítimas de violência doméstica. Estou aqui para:

- Ouvir você sem julgamentos
- Oferecer orientação psicológica
- Ajudar em situações de emergência
- Guiar você sobre seus direitos

    Tudo que conversarmos é PRIVADO e SEGURO.

    EMERGÊNCIA? Digite <strong>${PANIC_WORD}</strong> para <u>acionar alerta silencioso</u>.

Como você está se sentindo agora? Pode compartilhar o que quiser.`,
          timestamp: Date.now(),
          isAI: true,
        }]);
      } catch (e) {
        setStatus(CONNECTION_STATUS.ERROR);
      }
    })();
    return () => {
      mounted = false;
      chatAPI.disconnect();
    };
  }, []);

  useEffect(() => {
    // rolar para o fim a cada nova mensagem
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText = null) => {
    const text = (messageText || input || '').trim();
    if (!text || status !== CONNECTION_STATUS.CONNECTED) return;
    setInput('');
    setShowSuggestions(false);
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);
    try {
      // Se mensagem contém a palavra de segurança, aciona alerta silencioso
      if (text.toLowerCase().includes(PANIC_WORD)) {
        try {
          await triggerSilentAlert();
          setMessages(prev => [...prev, { id: `alert-${Date.now()}`, sender: 'system', text: '🚨 Alerta silencioso acionado! Seus contatos de confiança foram notificados com sua localização.', timestamp: Date.now() }]);
        } catch (e) {
          setMessages(prev => [...prev, { id: `alert-err-${Date.now()}`, sender: 'system', text: 'Falha ao acionar alerta silencioso.', timestamp: Date.now() }]);
        }
      }

      const history = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
      const reply = await chatAPI.sendMessage(text, history);
      setMessages(prev => [...prev, reply]);
    } catch (e) {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, sender: 'system', text: 'Não foi possível enviar a mensagem.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-top">
          <button
            className="btn-back"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            ← Voltar
          </button>
          <div className="header-title-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{flexShrink: 0}}>
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="#FF4C4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>Chat de Apoio</h1>
          </div>
        </div>
        <p className="chat-subtitle">Conversa segura e confidencial</p>
        <div className="status-container">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="chat-messages" ref={listRef}>
        {messages.map(m => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
            <div className="message assistant">
              <div style={{ fontSize: 11, color: '#A4B0BE', marginBottom: 6, fontWeight: 600 }}>Assistente IA</div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        {showSuggestions && messages.length === 1 && (
          <div className="quick-suggestions">
            <div style={{ fontSize: 13, color: '#A4B0BE', marginBottom: 10, fontWeight: 600 }}>Sugestões rápidas:</div>
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="suggestion-btn"
                onClick={() => handleSend(suggestion)}
                disabled={loading || status !== CONNECTION_STATUS.CONNECTED}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="chat-input-section">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Escreva sua mensagem"
          className="chat-input"
        />
        <button onClick={handleSend} disabled={!input.trim() || loading || status !== CONNECTION_STATUS.CONNECTED} className="send-btn">
          Enviar
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    [CONNECTION_STATUS.CONNECTED]: { label: 'Conectado', color: '#10B981' },
    [CONNECTION_STATUS.CONNECTING]: { label: 'Conectando…', color: '#F59E0B' },
    [CONNECTION_STATUS.DISCONNECTED]: { label: 'Desconectado', color: '#A4B0BE' },
    [CONNECTION_STATUS.ERROR]: { label: 'Erro', color: '#FF4C4C' },
  };
  const item = map[status] || map[CONNECTION_STATUS.DISCONNECTED];
  return <span style={{ background: item.color, color: '#FFFFFF', borderRadius: 16, padding: '6px 12px', fontSize: 12, fontWeight: 600 }}>{item.label}</span>;
};

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAI = message.isAI;
  const isSystem = message.sender === 'system';
  const align = isUser ? 'flex-end' : 'flex-start';
  let bubbleClass = 'message';
  if (isUser) bubbleClass += ' user';
  else if (isAI) bubbleClass += ' assistant';
  else if (isSystem) bubbleClass += ' system';
  const who = isUser ? 'Você' : isAI ? 'Assistente IA' : (isSystem ? 'Sistema' : 'Apoio');
  return (
    <div style={{ display: 'flex', justifyContent: align, marginBottom: 8 }}>
      <div className={bubbleClass}>
        <div className={isUser ? 'bubble-label' : 'bubble-header'}>{who}</div>
        <div dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
      </div>
    </div>
  );
};

export default Chat;
