// importa utilitários 
import React from "react";
import { RiskDot, riskLabel, formatTime, getDisplayName, sourceLabel } from "./utils";

export default function AlertList({
  filtered,
  selectedId,
  onSelect,
  filters,
  setFilters,
}) {
  return (
    <aside style={{ borderRight: "1px solid #e5e7eb", padding: 20, overflow: "auto", fontSize: 17 }}>
      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        <input
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          placeholder="Pesquisar por ID ou vitima..."
          style={{ padding: 14, borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 16 }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            style={{ padding: 14, borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 16 }}
          >
            <option value="all">Estado</option>
            <option value="new">Novo</option>
            <option value="in_process">Em processamento</option>
            <option value="in_progress">Em acompanhamento</option>
            <option value="resolved">Resolvido</option>
          </select>

          <select
            value={filters.source}
            onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
            style={{ padding: 14, borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 16 }}
          >
            <option value="all">Origem</option>
            <option value="app">App (sem dispositivo)</option>
            <option value="app_device">App (com dispositivo)</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: 16, color: "#6b7280", marginBottom: 12, fontWeight: 500 }}>
        Resultados: {filtered.length}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {filtered.map((a) => {
          const isSelected = a.id === selectedId;

          const statusText =
            a.status === "new"
              ? "Novo"
              : a.status === "in_process"
              ? "Em processamento"
              : a.status === "in_progress"
              ? "Em acompanhamento"
              : "Resolvido";

          const sourceText = sourceLabel(a.source);

          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              style={{
                textAlign: "left",
                padding: 16,
                borderRadius: 14,
                border: isSelected ? "3px solid #111827" : "1px solid #e5e7eb",
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{a.id}</div>
                <div style={{ fontSize: 15, color: "#6b7280" }}>
                  {formatTime(a.createdAt)}
                </div>
              </div>

              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <RiskDot risk={a.risk} />
                <span style={{ fontSize: 16, fontWeight: 600 }}>{riskLabel(a.risk)}</span>

                <span style={{ fontSize: 15, color: "#6b7280" }}>| {statusText}</span>
                <span style={{ fontSize: 15, color: "#6b7280" }}>| {sourceText}</span>
              </div>

              <div style={{ marginTop: 10, fontSize: 16, color: "#374151", fontWeight: 700 }}>
                {getDisplayName(a)}
              </div>

              <div style={{ marginTop: 8, fontSize: 15, color: "#6b7280" }}>
                Ultimo update: {formatTime(a.lastUpdateAt)}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}