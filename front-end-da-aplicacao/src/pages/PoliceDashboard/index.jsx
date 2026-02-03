import React, { useMemo, useState, useEffect } from "react";
import { alertsAPI } from "../../services/alertsAPI";
import TopBar from "./TopBar";
import AlertList from "./AlertList";
import MapView from "./MapView";
import AlertDetails from "./AlertDetails";

export default function PoliceDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // "all" = todos os pontos / "single" = só o selecionado
  const [mapMode, setMapMode] = useState("all");

  const [filters, setFilters] = useState({
    status: "all",
    risk: "all",
    source: "all",
    q: "",
  });

  // Carregar alertas do backend
  useEffect(() => {
    loadAlerts();
    // Atualizar a cada 3 segundos
    const interval = setInterval(loadAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await alertsAPI.getAllAlerts();
      const transformedAlerts = data.map(alertsAPI.transformAlert);
      setAlerts(transformedAlerts);
      
      // Se não há alerta selecionado, selecionar o primeiro
      if (!selectedId && transformedAlerts.length > 0) {
        setSelectedId(transformedAlerts[0].id);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
      setError('Erro ao carregar alertas. Verifique se o servidor está ativo.');
    } finally {
      setLoading(false);
    }
  };

  const selected = useMemo(() => {
    return alerts.find((a) => a.id === selectedId) ?? alerts[0] ?? null;
  }, [alerts, selectedId]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    return alerts.filter((a) => {
      if (filters.status !== "all" && a.status !== filters.status) return false;
      if (filters.risk !== "all" && a.risk !== filters.risk) return false;
      if (filters.source !== "all" && a.source !== filters.source) return false;

      if (q) {
        const hay = `${a.id} ${a.fullName ?? ""} ${a.anonymousId ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [alerts, filters]);

  const activeCount = useMemo(() => {
    return alerts.filter((a) => a.status !== "resolved").length;
  }, [alerts]);

  // tempo médio até evento que contenha "em acompanhamento"
  const avgResponseSeconds = useMemo(() => {
    const diffsMs = alerts
      .map((a) => {
        const created = new Date(a.createdAt).getTime();
        if (Number.isNaN(created)) return null;

        const ev = (a.history ?? []).find((h) =>
          String(h.event || "").toLowerCase().includes("em acompanhamento")
        );
        if (!ev) return null;

        const handled = new Date(ev.at).getTime();
        if (Number.isNaN(handled)) return null;

        return handled - created;
      })
      .filter((x) => typeof x === "number" && x >= 0);

    if (!diffsMs.length) return null;
    const avgMs = diffsMs.reduce((s, v) => s + v, 0) / diffsMs.length;
    return Math.round(avgMs / 1000);
  }, [alerts]);

  // última atualização real (maior lastUpdateAt)
  const lastEventAt = useMemo(() => {
    const times = alerts
      .map((a) => new Date(a.lastUpdateAt).getTime())
      .filter((t) => !Number.isNaN(t));

    if (!times.length) return null;
    return new Date(Math.max(...times)).toISOString();
  }, [alerts]);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        height: "100vh",
        width: "100vw",
        background: "#f8fafc",
        overflowX: "auto",
      }}
    >
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.9)',
          zIndex: 9999,
        }}>
          <div style={{ fontSize: 18, color: '#666' }}>
            🔄 A carregar alertas...
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fee',
          padding: '12px 24px',
          color: '#c33',
          borderBottom: '2px solid #c33',
          textAlign: 'center',
        }}>
          ⚠️ {error}
        </div>
      )}

      <TopBar
        activeCount={activeCount}
        totalCount={alerts.length}
        avgResponseSeconds={avgResponseSeconds}
        lastEventAt={lastEventAt}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr 420px",
          height: "calc(100vh - 54px)",
          minWidth: 1300,
        }}
      >
        <AlertList
          filtered={filtered}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setMapMode("single");
          }}
          filters={filters}
          setFilters={setFilters}
        />

        <MapView
          alerts={filtered}
          selected={selected}
          mapMode={mapMode}
          onSelect={(id) => {
            setSelectedId(id);
            setMapMode("single");
          }}
          onReset={() => setMapMode("all")}
        />

        <AlertDetails selected={selected} setAlerts={setAlerts} setSelectedId={setSelectedId} />
      </div>
    </div>
  );
}