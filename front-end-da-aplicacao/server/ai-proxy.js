// Simple AI proxy server to keep API keys off the frontend
// Supports OpenAI and Azure OpenAI. Choose via AI_PROVIDER env.
// CommonJS for compatibility with Node on Windows.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // 'openai' | 'azure'

// OpenAI config
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Azure OpenAI config
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT; // e.g. https://your-resource.openai.azure.com
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT; // your deployment name
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview';

function normalizeMessages(history = [], message) {
  const msgs = Array.isArray(history) ? history : [];
  return [
    ...msgs.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    { role: 'user', content: message }
  ];
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Parâmetro "message" obrigatório.' });
    }

    const messages = normalizeMessages(history, message);

    if (AI_PROVIDER === 'azure') {
      if (!AZURE_OPENAI_API_KEY || !AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_DEPLOYMENT) {
        return res.status(500).json({ error: 'Azure OpenAI não configurado corretamente.' });
      }
      const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;
      const response = await axios.post(
        url,
        { messages, temperature: 0.7 },
        { headers: { 'api-key': AZURE_OPENAI_API_KEY, 'Content-Type': 'application/json' } }
      );
      const choice = response.data?.choices?.[0];
      const reply = choice?.message?.content || 'Desculpe, não consegui responder agora.';
      return res.json({ reply });
    }

    // Default: OpenAI
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key não configurada.' });
    }
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model: OPENAI_MODEL, messages, temperature: 0.7 },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    const choice = response.data?.choices?.[0];
    const reply = choice?.message?.content || 'Desculpe, não consegui responder agora.';
    return res.json({ reply });
  } catch (err) {
    console.error('AI proxy error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Falha ao consultar o provedor de IA.' });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`AI proxy em http://localhost:${PORT}\nProvider: ${AI_PROVIDER}`);
});
