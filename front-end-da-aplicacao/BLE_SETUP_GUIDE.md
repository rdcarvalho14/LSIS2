# 🚨 Guia de Conexão: Seeed XIAO nRF52840 ↔ Aplicação React Web

## ✅ Configuração Concluída

### 📦 O que foi feito:

1. **bleService.js** - Serviço BLE com Web Bluetooth API
2. **EmergencyContext** - Integrado com BLE para disparar alertas automaticamente
3. **BLEButton** - Componente visual para conectar o botão
4. **Home** - Interface completa com botão BLE

---

## 🔌 Como Usar

### 1️⃣ **Carregue o código Arduino no Seeed XIAO nRF52840**
   - Abra o Arduino IDE
   - Cole o código fornecido
   - Selecione placa: `Seeed XIAO BLE - nRF52840`
   - Carregue o código

### 2️⃣ **Inicie a aplicação React**
   ```bash
   npm start
   ```

### 3️⃣ **Use um browser compatível**
   - ✅ Chrome
   - ✅ Edge
   - ✅ Opera
   - ❌ Firefox (não suporta Web Bluetooth API)

### 4️⃣ **Na aplicação:**
   1. Faça login
   2. Na tela Home, veja a seção "Botão BLE"
   3. Clique em **"🔗 Conectar Botão SOS"**
   4. Selecione **"SOS_Button"** na janela que abrir
   5. Aguarde conexão (LED do Seeed ficará aceso fixo)

### 5️⃣ **Teste o alerta:**
   - Pressione o botão físico do Seeed por **3 segundos**
   - LED piscará rápido
   - ✅ Aplicação receberá o alerta e disparará automaticamente

---

## 🔍 Troubleshooting

### ❌ "Bluetooth não suportado"
- Use Chrome/Edge/Opera
- Ative Bluetooth no sistema operacional
- Acesse via HTTPS (ou localhost)

### ❌ "SOS_Button não aparece"
- Verifique se o Seeed está ligado (LED piscando devagar = aguardando conexão)
- Aproxime o dispositivo do computador
- Reinicie o Seeed

### ❌ Botão não envia alerta
- Verifique se está conectado (LED aceso fixo)
- Pressione por pelo menos 3 segundos
- Veja logs no Serial Monitor do Arduino (115200 baud)

---

## 📡 UUIDs do BLE

```javascript
Service:        19B10000-E8F2-537E-4F6C-D104768A1214
Characteristic: 19B10001-E8F2-537E-4F6C-D104768A1214
Device Name:    SOS_Button
```

---

## 🎯 Fluxo Completo

```
1. Usuário pressiona botão físico por 3 seg
   ↓
2. Seeed envia notificação BLE (valor = 1)
   ↓
3. bleService.js recebe a notificação
   ↓
4. EmergencyContext.triggerSilentAlert() é chamado
   ↓
5. Alerta SOS enviado automaticamente para contatos de confiança
```

---

## 🔐 Segurança

- Conexão BLE direta (sem internet necessária)
- Dados não são transmitidos pela rede
- Funciona mesmo offline (apenas geolocalização precisa de GPS ativo)

---

## 🚀 Próximos Passos (Opcional)

- [ ] Adicionar vibração no dispositivo quando alerta é enviado
- [ ] Implementar reconexão automática
- [ ] Adicionar bateria low warning
- [ ] Criar modo discreto (sem feedback visual)
