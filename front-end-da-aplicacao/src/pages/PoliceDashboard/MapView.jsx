import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatTime, riskLabel, getDisplayName, sourceLabel } from "./utils";

// Fix do ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Criar ícones personalizados para diferentes estados
const createIcon = (color, isBlinking = false) => {
  const blinkClass = isBlinking ? 'blinking-marker' : '';
  return L.divIcon({
    className: `custom-marker ${blinkClass}`,
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        ${isBlinking ? 'animation: pulse 1s ease-in-out infinite;' : ''}
      "></div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Ícones para cada estado
const redBlinkingIcon = createIcon('#ef4444', true);
const orangeBlinkingIcon = createIcon('#f1f916', true);
const greenIcon = createIcon('#22c55e', false);

// Adicionar CSS para animação de piscar
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.7;
    }
  }
  .blinking-marker div {
    animation: pulse 1s ease-in-out infinite;
  }
`;
if (!document.querySelector('#marker-pulse-style')) {
  style.id = 'marker-pulse-style';
  document.head.appendChild(style);
}

// Função para obter o ícone baseado no status do alerta
const getMarkerIcon = (status) => {
  switch (status) {
    case 'resolved':
      return greenIcon;
    case 'in_progress':
      return orangeBlinkingIcon;
    case 'new':
    default:
      return redBlinkingIcon;
  }
};

function Recenter({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat != null && lng != null) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);

  return null;
}

export default function MapView({
  alerts = [],
  selected,
  mapMode = "all", // "all" | "single"
  onSelect,
  onReset,
}) {
  const center = [selected?.lat ?? 41.1579, selected?.lng ?? -8.6291];

  const pointsToShow =
    mapMode === "single" && selected ? [selected] : alerts;

  return (
    <main style={{ padding: 12, height: "100%", position: "relative" }}>
      {mapMode === "single" && (
        <button
          onClick={onReset}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 18,
            right: 18,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            boxShadow: "0 1px 10px rgba(0,0,0,0.12)",
          }}
          title="Voltar a mostrar todos os pontos"
        >
          Mostrar todos
        </button>
      )}

      <div
        style={{
          height: "100%",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
          <Recenter lat={selected?.lat} lng={selected?.lng} />

          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pointsToShow
            .filter((a) => typeof a.lat === "number" && typeof a.lng === "number")
            .map((a) => (
              <Marker
                key={a.id}
                position={[a.lat, a.lng]}
                icon={getMarkerIcon(a.status)}
                eventHandlers={{
                  click: () => onSelect?.(a.id),
                }}
              >
                <Popup>
                  <div style={{ fontWeight: 700 }}>{a.id}</div>
                  <div>{getDisplayName(a)}</div>
                  <div>Estado: {a.status === 'resolved' ? '✅ Resolvido' : a.status === 'in_progress' ? ' Em acompanhamento' : '🔴 Novo'}</div>
                  <div>Risco: {riskLabel(a.risk)}</div>
                  <div>Origem: {sourceLabel(a.source)}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    Último update: {formatTime(a.lastUpdateAt)}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </main>
  );
}