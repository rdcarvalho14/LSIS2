import React, { useState } from "react";
import { alertsAPI } from "../../services/alertsAPI";
import { RiskDot, formatTime, riskLabel, getDisplayName, sourceLabel } from "./utils";
import VictimDetailsModal from "./VictimDetailsModal";

export default function AlertDetails({ selected, setAlerts, setSelectedId }) {
  const [showVictimModal, setShowVictimModal] = useState(false);

  if (!selected) {
    return (
      <section style={{ borderLeft: "1px solid #e5e7eb", padding: 12 }}>
        Sem alerta selecionado.
      </section>
    );
  }

  const statusLabel =
    selected.status === "new"
      ? "Novo"
      : selected.status === "in_process"
      ? "Em processamento"
      : selected.status === "in_progress"
      ? "Em acompanhamento"
      : "Resolvido";

  const sourceText = sourceLabel(selected.source);

  // Atualizar status no backend e UI
  async function updateStatus(nextStatus) {
    const nowIso = new Date().toISOString();

    const statusMap = {
      in_progress: { api: "EM ACOMPANHAMENTO", label: "Em acompanhamento" },
      resolved: { api: "RESOLVIDO", label: "Alerta resolvido" },
    };

    const payload = statusMap[nextStatus];
    if (!payload) return;

    try {
      await alertsAPI.updateAlertStatus(selected.id, payload.api);

      setAlerts((prev) =>
        prev.map((a) =>
          a.id === selected.id
            ? {
                ...a,
                status: nextStatus,
                lastUpdateAt: nowIso,
                history: [{ at: nowIso, event: payload.label, by: "Operador" }, ...(a.history ?? [])],
              }
            : a
        )
      );
    } catch (err) {
      alert("Erro ao atualizar status: " + err.message);
    }
  }

  async function deleteAlert() {
    if (!selected?.id) return;
    const confirmed = window.confirm("Tem a certeza que deseja apagar este alerta?");
    if (!confirmed) return;

    try {
      await alertsAPI.deleteAlert(selected.id);

      setAlerts((prev) => {
        const next = prev.filter((a) => a.id !== selected.id);
        if (setSelectedId) {
          const nextSelected = next[0]?.id ?? null;
          setSelectedId(nextSelected);
        }
        return next;
      });
    } catch (err) {
      alert("Erro ao apagar alerta: " + err.message);
    }
  }

  return (
    <section style={{ borderLeft: "1px solid #e5e7eb", padding: 22, overflow: "auto", fontSize: 17 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{selected.id}</div>
        <div style={{ fontSize: 16, color: "#6b7280" }}>{formatTime(selected.createdAt)}</div>
      </div>

      <div style={{ marginTop: 16, padding: 20, border: "1px solid #e5e7eb", borderRadius: 16, background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <RiskDot risk={selected.risk} />
          <div style={{ fontWeight: 700, fontSize: 18 }}>Risco {riskLabel(selected.risk)}</div>
        </div>

        <div style={{ marginTop: 14, fontSize: 17, color: "#374151", lineHeight: 2 }}>
          <div>
            <strong>Vitima:</strong>{" "}
            {selected.userId ? (
              <button
                onClick={() => setShowVictimModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: 17,
                  fontWeight: 600,
                  padding: 0,
                }}
                title="Clique para ver detalhes da vítima e agressor"
              >
                {getDisplayName(selected)} 📋
              </button>
            ) : (
              <span>{getDisplayName(selected)}</span>
            )}
          </div>
          <div><strong>Origem:</strong> {sourceText}</div>
          <div><strong>Estado:</strong> {statusLabel}</div>
          <div>
            <strong>Localizacao:</strong>{" "}
            {selected.lat?.toFixed?.(5)}, {selected.lng?.toFixed?.(5)}
          </div>
          <div><strong>Ultima atualizacao:</strong> {formatTime(selected.lastUpdateAt)}</div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => updateStatus("in_progress")}
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              border: "2px solid #fbbf24",
              background: "#fef3c7",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Marcar como "Em acompanhamento"
          </button>

          <button
            onClick={() => updateStatus("resolved")}
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              border: "2px solid #22c55e",
              background: "#dcfce7",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Marcar como "Resolvido"
          </button>

          <button
            onClick={deleteAlert}
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              border: "2px solid #fecaca",
              background: "#fff",
              color: "#b91c1c",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Apagar alerta
          </button>
        </div>
      </div>

      <div style={{ marginTop: 20, fontWeight: 800, fontSize: 18 }}>Linha temporal</div>

      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        {(selected.history ?? []).map((h, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff" }}>
            <div style={{ fontSize: 15, color: "#6b7280" }}>{formatTime(h.at)}</div>
            <div style={{ marginTop: 8, fontSize: 16 }}>{h.event}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, fontSize: 15, color: "#6b7280" }}>
        Conectado ao backend - Atualizacoes automaticas a cada 10 segundos
      </div>

      {/* Modal de detalhes da vítima */}
      {showVictimModal && selected.userId && (
        <VictimDetailsModal
          userId={selected.userId}
          victimName={getDisplayName(selected)}
          onClose={() => setShowVictimModal(false)}
        />
      )}
    </section>
  );
}
