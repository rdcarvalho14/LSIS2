# 🛡️ App de Segurança para Vítimas - Frontend (React)

Aplicativo React de apoio a vítimas de violência doméstica em Portugal.

## ⚠️ IMPORTANTE: SEGURANÇA CRÍTICA

Este app se disfarça como uma **Calculadora** para proteger a identidade da usuária.

**Código de acesso secreto:** Digite `1991*` na calculadora para acessar o app real.

---

## 🚀 Começar

### Instalação

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build para produção

```bash
npm run build
```

---

## 📁 Estrutura do Projeto

```
src/
├── App.js                     # Rotas principais
├── index.js                   # Entry point
├── components/                # Componentes reutilizáveis (pastas vazias)
│   ├── Calculator/
│   ├── EmergencyButton/
│   ├── DiaryEntry/
│   └── Navigation/
├── pages/                     # Telas principais
│   ├── Calculator.jsx ✅      # Tela 0 - DISFARCE (implementada)
│   ├── Calculator.css ✅
│   ├── Home.jsx ✅            # Tela 1 - Painel principal
│   ├── Home.css ✅
│   ├── Diary.jsx              # Tela 2 - Placeholder
│   ├── Network.jsx            # Tela 3 - Placeholder
│   ├── Resources.jsx          # Tela 4 - Placeholder
│   └── Chat.jsx               # Tela 5 - Placeholder
├── contexts/                  # Estado global
│   ├── AuthContext.jsx ✅     # Controle de acesso secreto
│   ├── DiaryContext.jsx ✅    # Gerenciamento do diário
│   └── EmergencyContext.jsx ✅ # Contatos e alertas
├── services/                  # Lógica de negócio
│   ├── crypto.js ✅           # Web Crypto API
│   ├── storage.js ✅          # IndexedDB (Dexie)
│   ├── geolocation.js ✅      # GPS tracking
│   └── chatAPI.js ✅          # MOCKADO - backend futuro
├── hooks/                     # Custom hooks
│   ├── useAuth.js ✅
│   ├── useDiary.js ✅
│   └── useGeolocation.js ✅
├── utils/
│   ├── constants.js ✅        # Números emergência Portugal
│   └── validators.js ✅       # Validações frontend
└── styles/
    ├── global.css ✅          # Reset + variáveis CSS
    └── theme.js ✅            # Cores e tipografia
```

---

## 🔒 Recursos de Segurança Implementados

### ✅ Disfarce Permanente
- App inicia sempre como calculadora funcional
- Código secreto (`1991*`) para acesso ao app real
- Transição instantânea sem animação suspeita

### ✅ Retorno Automático ao Disfarce
- Ao minimizar o app → volta para calculadora automaticamente
- Inatividade de 5 minutos → desloga por segurança
- Qualquer rota não encontrada → redireciona para calculadora

### ✅ Criptografia Client-Side
- Web Crypto API (AES-GCM 256-bit)
- Diário criptografado antes de salvar
- Dados nunca saem do dispositivo sem criptografia

### ✅ Armazenamento Local Seguro
- IndexedDB via Dexie.js
- Dados criptografados
- Sem histórico em servidor (frontend-only)

### ✅ Diário Imutável
- Entradas **NÃO podem ser editadas**
- Entradas **NÃO podem ser apagadas**
- Timestamp automático e imutável

---

## 🌐 APIs Mockadas (Backend Futuro)

O arquivo `src/services/chatAPI.js` contém implementações mockadas das funcionalidades que serão integradas com o backend:


Todas as funções retornam Promises com dados simulados para desenvolvimento.

---

## 🤖 IA no Chat (opcional)

Para usar respostas de IA no chat, configure um endpoint backend seguro (para não expor a chave no frontend) e defina a variável de ambiente.

### Passo 1: Variável de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```
REACT_APP_AI_ENDPOINT=http://localhost:8787/api/chat
```

### Passo 2: Exemplo de backend proxy

Implemente um pequeno servidor (Node/Express ou serverless) que receba `{ message, history }` e retorne `{ reply }`. Exemplo com Express:

```js
// server.js (executar fora do bundle do React)
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message, history = [] } = req.body;
    try {
        // Substitua pela chamada ao provedor de IA (Azure/OpenAI/etc.)
        // Ex.: POST na API com sua chave em variáveis de ambiente do servidor
        const reply = `Eco (mock backend): ${message}`;
        res.json({ reply });
    } catch (e) {
        res.status(500).json({ error: 'IA indisponível' });
    }
});

app.listen(8787, () => console.log('AI proxy em http://localhost:8787'));
```

No frontend, `src/services/chatAPI.js` detecta `REACT_APP_AI_ENDPOINT` e passa a enviar as mensagens para esse endpoint; em caso de erro, cai no mock local.

## ▶️ Como rodar com IA real

1. Copie `.env.example` para `.env` e preencha sua chave do provedor:

```
# Frontend
REACT_APP_AI_ENDPOINT=http://localhost:8787/api/chat

# Backend (AI proxy)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Para Azure OpenAI:

```
AI_PROVIDER=azure
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://seu-recurso.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=nome-do-deploy
AZURE_OPENAI_API_VERSION=2024-08-01-preview
```

2. Instale as dependências do servidor proxy:

```bash
npm install express cors dotenv axios
```

3. Inicie o proxy em um terminal:

```bash
npm run ai:proxy
```

4. Em outro terminal, inicie o frontend:

```bash
npm start
```

Abra o chat em http://localhost:3000. As respostas agora virão do modelo configurado.


## 📞 Números de Emergência (Portugal)

| Serviço | Número |
|---------|--------|
| Emergência Geral | 112 |
| Linha de Apoio à Vítima | 116 006 |
| APAV | 707 200 077 |
| SOS Criança | 116 111 |

---

## 🎨 Design System

### Cores Principais
- `--primary`: #6B7280 (Cinza neutro)
- `--danger`: #EF4444 (Vermelho emergência)
- `--success`: #10B981 (Verde segurança)
- `--background`: #F9FAFB (Fundo claro)
- `--text`: #1F2937 (Texto escuro)

### Acessibilidade
- Botões mínimos de 44x44px (touch target)
- Contraste WCAG AA
- Feedback visual imediato
- Estados de loading/erro

---

## 🧪 Testar Funcionalidades

### Acessar o App Real
1. Na calculadora, digite: `1991*`
2. App navegará instantaneamente para a tela Home

### Testar Disfarce
1. Minimize o navegador/app
2. Ao maximizar, estará na calculadora novamente
3. Necessário digitar código novamente para entrar

### Testar Diário (quando implementado)
- Adicionar entradas com texto/foto/áudio
- Verificar que não há botões de editar/apagar
- Conferir criptografia no IndexedDB (DevTools → Application)

---

## 🔧 Tecnologias Utilizadas

- **React 18** - Framework UI (Create React App)
- **React Router DOM 7** - Navegação
- **Dexie.js 4** - IndexedDB wrapper
- **Web Crypto API** - Criptografia nativa
- **Geolocation API** - GPS tracking

---

## 📊 Estatísticas do Projeto

- **Arquivos criados:** 26 arquivos JS/JSX/CSS
- **Build status:** ✅ Compilado com sucesso
- **Erros:** ✅ Nenhum erro
- **Framework:** Create React App (conforme solicitado)

---

## 📝 Próximos Passos

### Frontend (a implementar):
- [ ] Componentes de botões de emergência
- [ ] Formulário de entrada do diário com criptografia
- [ ] Interface de chat mockada
- [ ] Formulários de contatos e agressor
- [ ] Página de recursos educativos
- [ ] PWA (service worker para offline)

### Backend (outra pessoa):
- [ ] WebSocket para chat ao vivo
- [ ] IA para respostas automáticas
- [ ] Dashboard de monitoramento
- [ ] Sistema de status (verde/amarelo/vermelho)
- [ ] Notificações SMS/push para alertas
- [ ] Integração com autoridades

---

## ⚠️ Avisos Importantes

1. **NÃO compartilhe o código secreto** em documentação pública
2. **NÃO implemente backend** neste repositório (frontend-only)
3. **SEMPRE teste o disfarce** antes de deploy
4. **Mantenha o diário imutável** (segurança da vítima)

---

## 📄 Licença

Este projeto é confidencial e destinado exclusivamente ao apoio a vítimas de violência doméstica.

---

**✅ PROJETO MIGRADO COM SUCESSO DE VITE PARA CREATE REACT APP**

**Desenvolvido com foco em segurança e privacidade para proteger vidas.**


