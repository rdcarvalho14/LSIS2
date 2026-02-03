# Dashboard Policial - Guia de Utilização

## 📋 Descrição
Dashboard independente para monitorização de alertas SOS em tempo real. Não requer autenticação e atualiza automaticamente a cada 10 segundos.

## 🌐 Acesso
- **URL**: `http://localhost:3000/police-dashboard`
- **Acesso**: Público (sem necessidade de login)
- **Porto Backend**: `http://localhost:5000`

## 🚀 Como Iniciar

### 1. Iniciar o Backend
```bash
cd APP_BE/server
node server.js
```

### 2. Iniciar a Aplicação React
```bash
npm start
```

### 3. Aceder à Dashboard
Abrir no navegador: `http://localhost:3000/police-dashboard`

## 📱 Funcionalidades

### Visualização de Alertas
- **Lista de alertas**: Painel esquerdo com todos os alertas
- **Mapa interativo**: Visualização geográfica dos alertas
- **Detalhes**: Painel direito com informações detalhadas

### Filtros Disponíveis
- **Status**: Novo, Em acompanhamento, Resolvido
- **Risco**: Alto, Médio, Baixo
- **Origem**: App, Dispositivo físico
- **Pesquisa**: Por ID ou nome

### Ações Disponíveis
- ✅ **Marcar como "Em acompanhamento"**
- ✅ **Fechar alerta** (marcar como resolvido)

## 🔔 Quando um SOS é Acionado

Quando um utilizador aciona o botão SOS na aplicação:

1. **Localização GPS** é capturada automaticamente
2. **Alerta é enviado** para:
   - Contatos de confiança configurados
   - **Dashboard policial** (através da API)
3. **Dashboard atualiza** automaticamente mostrando:
   - Novo alerta em tempo real
   - Localização no mapa
   - Informações da vítima (se disponíveis)

## 🗄️ Estrutura de Dados

### Alerta no Backend
```javascript
{
  id: "uuid",
  user_id: "uuid",
  origem: "APP" | "DEVICE",
  status: "EM PROCESSO" | "EM ACOMPANHAMENTO" | "RESOLVIDO",
  latitude: number,
  longitude: number,
  created_at: timestamp
}
```

### Alerta na Dashboard
```javascript
{
  id: string,
  status: "pending" | "in-progress" | "resolved",
  risk: "high" (todos os SOS são alto risco),
  source: "APP" | "DEVICE",
  location: { latitude, longitude },
  fullName: string (se identificado),
  anonymousId: string (se anônimo),
  createdAt: timestamp,
  history: [eventos]
}
```

## 🔧 Endpoints da API

### GET `/api/alerts`
Buscar todos os alertas
```bash
curl http://localhost:5000/api/alerts
```

### POST `/api/alert`
Criar novo alerta (acionado pelo SOS)
```bash
curl -X POST http://localhost:5000/api/alert \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "origem": "APP",
    "latitude": 41.1579,
    "longitude": -8.6291
  }'
```

### PUT `/api/alerts/:alertId/status`
Atualizar status do alerta
```bash
curl -X PUT http://localhost:5000/api/alerts/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "EM ACOMPANHAMENTO"}'
```

## 🧪 Teste Rápido

Para testar a integração completa:

1. **Iniciar servidores** (backend + frontend)
2. **Abrir dashboard**: `http://localhost:3000/police-dashboard`
3. **Fazer login na app** e acionar o SOS
4. **Verificar** se o alerta aparece na dashboard
5. **Atualizar status** usando os botões da dashboard

## 🔄 Atualização Automática

- Dashboard atualiza a cada **10 segundos**
- Busca novos alertas automaticamente
- Sem necessidade de refresh manual

## 📝 Notas Importantes

- Dashboard é **independente** da aplicação principal
- Não requer login ou autenticação
- Alertas são salvos na base de dados PostgreSQL
- Mapas usam **Leaflet** e **OpenStreetMap**

## 🐛 Troubleshooting

### Dashboard não carrega alertas
- Verificar se o backend está ativo em `http://localhost:5000`
- Verificar logs do terminal do backend
- Verificar console do navegador (F12)

### Alertas não aparecem
- Confirmar que a base de dados está criada
- Verificar se as tabelas foram criadas (`alerts`, `users`)
- Testar endpoint diretamente: `curl http://localhost:5000/api/alerts`

### Mapa não aparece
- Verificar se o Leaflet foi instalado: `npm list leaflet react-leaflet`
- Verificar conexão à internet (usa tiles do OpenStreetMap)
