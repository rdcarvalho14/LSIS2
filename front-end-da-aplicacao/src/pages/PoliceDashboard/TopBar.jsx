//Importa:
//Badge → componente visual reutilizável (pílulas).
//formatTime → função que formata datas.

import React from "react";
import { Badge, formatTime } from "./utils";

export default function TopBar({
  activeCount,
  totalCount,
  avgResponseSeconds,
  lastEventAt,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 32 }}>Dashboard Operacional</div>

      <Badge>Alertas ativos: {activeCount}</Badge>
      <Badge>Total: {totalCount}</Badge>

      <Badge>
        {avgResponseSeconds !== null
          ? `Tempo medio ate acompanhamento: ~${avgResponseSeconds}s`
          : "Tempo medio: n/d"}
      </Badge>

      <div style={{ marginLeft: "auto", fontSize: 17, color: "#6b7280" }}>
        Ultima atualizacao: {lastEventAt ? formatTime(lastEventAt) : "n/d"}
      </div>
    </div>
  );
}