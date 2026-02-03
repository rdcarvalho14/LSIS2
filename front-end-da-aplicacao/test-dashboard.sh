#!/bin/bash
# test-dashboard.sh - Script de teste rápido da dashboard policial

echo "🔍 Testando Dashboard Policial"
echo "================================"
echo ""

# Verificar se o servidor está ativo
echo "1️⃣ Verificando servidor backend..."
if curl -s http://localhost:5000/api/alerts > /dev/null 2>&1; then
    echo "   ✅ Backend ativo em http://localhost:5000"
else
    echo "   ❌ Backend não está ativo!"
    echo "   Execute: cd APP_BE/server && node server.js"
    exit 1
fi

# Buscar alertas existentes
echo ""
echo "2️⃣ Buscando alertas existentes..."
ALERTS=$(curl -s http://localhost:5000/api/alerts)
COUNT=$(echo $ALERTS | jq '. | length' 2>/dev/null || echo "0")
echo "   📊 Total de alertas: $COUNT"

# Criar alerta de teste (opcional - comentado)
# echo ""
# echo "3️⃣ Criando alerta de teste..."
# curl -s -X POST http://localhost:5000/api/alert \
#   -H "Content-Type: application/json" \
#   -d '{
#     "user_id": "test-user-123",
#     "origem": "APP",
#     "status": "EM PROCESSO",
#     "latitude": 41.1579,
#     "longitude": -8.6291
#   }' | jq .

echo ""
echo "✅ Testes concluídos!"
echo ""
echo "🌐 Acesse a dashboard em: http://localhost:3000/police-dashboard"
