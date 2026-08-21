import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useSafety } from '../../context/SafetyContext';
import { Crosshair, Compass, AlertTriangle, MapPin, Layers } from 'lucide-react';

interface SafeTransitMapProps {
  heightClass?: string;
  isGuardianView?: boolean;
  showControls?: boolean;
}

export const SafeTransitMap: React.FC<SafeTransitMapProps> = ({
  heightClass = 'h-[300px]',
  isGuardianView = false,
  showControls = true,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const travelerMarker = useRef<L.Marker | null>(null);
  const normalPoly = useRef<L.Polyline | null>(null);
  const devPoly = useRef<L.Polyline | null>(null);
  const dangerCircles = useRef<L.Circle[]>([]);
  const heatmapCircles = useRef<L.Circle[]>([]);
  const wpMarkers = useRef<L.Marker[]>([]);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const { state, activeRoute, riskEvaluation } = useSafety();

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center: activeRoute.normalPath[0] || [18.5018, 73.8586],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  // Update route layers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    normalPoly.current?.remove();
    devPoly.current?.remove();
    dangerCircles.current.forEach(c => c.remove());
    dangerCircles.current = [];
    wpMarkers.current.forEach(m => m.remove());
    wpMarkers.current = [];

    const nPoly = L.polyline(activeRoute.normalPath, {
      color: '#7c3aed',
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    normalPoly.current = nPoly;

    if (activeRoute.deviationPath?.length) {
      devPoly.current = L.polyline(activeRoute.deviationPath, {
        color: state.isDeviated ? '#f43f5e' : '#94a3b8',
        weight: state.isDeviated ? 4 : 2.5,
        opacity: state.isDeviated ? 0.9 : 0.4,
        dashArray: '6,8',
      }).addTo(map);
    }

    activeRoute.dangerZones.forEach(zone => {
      const c = L.circle(zone.center, {
        radius: zone.radiusMeters,
        color: '#f43f5e',
        fillColor: '#f43f5e',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4,6',
      }).addTo(map);
      c.bindTooltip(`⚠️ ${zone.name}`, { direction: 'top', className: 'leaflet-tooltip-custom' });
      dangerCircles.current.push(c);
    });

    activeRoute.waypoints.forEach((wp, idx) => {
      const isStart = idx === 0;
      const isEnd = idx === activeRoute.waypoints.length - 1;
      const icon = L.divIcon({
        html: `<div style="
          width:24px;height:24px;border-radius:50%;
          background:${isStart ? '#10b981' : isEnd ? '#7c3aed' : '#ffffff'};
          border:2px solid ${isStart ? '#059669' : isEnd ? '#6d28d9' : '#cbd5e1'};
          display:flex;align-items:center;justify-content:center;
          font-size:10px;font-weight:800;color:${isStart || isEnd ? 'white' : '#475569'};
          box-shadow:0 2px 8px rgba(0,0,0,0.15);
        ">${isStart ? '🚩' : isEnd ? '🏁' : idx}</div>`,
        className: '', iconSize: [24, 24], iconAnchor: [12, 12],
      });
      const m = L.marker([wp.lat, wp.lng], { icon }).addTo(map);
      m.bindPopup(`<b>${wp.name}</b><br/><span style="font-size:11px;color:#64748b">${wp.landmark || ''}</span><br/><span style="font-size:10px">⏱ +${wp.estimatedTimeMin} min • 💡 ${wp.lightingQuality}</span>`);
      wpMarkers.current.push(m);
    });

    map.fitBounds(nPoly.getBounds(), { padding: [30, 30] });
  }, [activeRoute, state.isDeviated]);

  // Heatmap Overlay Layer
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    heatmapCircles.current.forEach(c => c.remove());
    heatmapCircles.current = [];

    if (showHeatmap) {
      // Swargate Metro Hub (Green 92%)
      const c1 = L.circle([18.5018, 73.8586], { radius: 240, color: '#10b981', fillColor: '#10b981', fillOpacity: 0.22, weight: 1 }).addTo(map);
      c1.bindTooltip('🟢 Swargate Safety Index: 92/100 (High CCTV & Lighting)', { direction: 'top' });
      heatmapCircles.current.push(c1);

      // Satara Road BRT (Green 86%)
      const c2 = L.circle([18.4895, 73.8572], { radius: 260, color: '#10b981', fillColor: '#10b981', fillOpacity: 0.18, weight: 1 }).addTo(map);
      c2.bindTooltip('🟢 Satara Rd Corridor: 86/100 (Active BRT Lane)', { direction: 'top' });
      heatmapCircles.current.push(c2);

      // Padmavati Chowk (Amber 84%)
      const c3 = L.circle([18.4770, 73.8585], { radius: 220, color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.20, weight: 1 }).addTo(map);
      c3.bindTooltip('🟡 Padmavati BRT: 84/100 (Moderate Footfall)', { direction: 'top' });
      heatmapCircles.current.push(c3);

      // VIT Pune Campus Zone (Green 90%)
      const c4 = L.circle([18.4635, 73.8682], { radius: 280, color: '#10b981', fillColor: '#10b981', fillOpacity: 0.22, weight: 1 }).addTo(map);
      c4.bindTooltip('🟢 VIT Pune Student Hub: 90/100 (Campus Security Active)', { direction: 'top' });
      heatmapCircles.current.push(c4);

      // Market Yard Hinterland (Red 38%)
      const c5 = L.circle([18.4845, 73.8745], { radius: 360, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.28, weight: 2, dashArray: '4,4' }).addTo(map);
      c5.bindTooltip('🔴 Market Yard Hinterland: 38/100 (Caution: Low Lighting, Industrial Backroad)', { direction: 'top' });
      heatmapCircles.current.push(c5);
    }
  }, [showHeatmap]);

  // Update traveler dot
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const isCrit = riskEvaluation.riskLevel === 'critical' || state.isSosTriggered;
    const isWarn = riskEvaluation.riskLevel === 'caution';
    const color = isCrit ? '#f43f5e' : isWarn ? '#f59e0b' : '#7c3aed';
    const pulse = isCrit ? 'animation:pulse 1s infinite' : '';

    const icon = L.divIcon({
      html: `<div style="position:relative">
        <div style="width:32px;height:32px;border-radius:50%;background:${color};
          border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25),0 0 0 6px ${color}33;
          display:flex;align-items:center;justify-content:center;font-size:14px;${pulse}">
          ${isCrit ? '🚨' : isGuardianView ? '🛡️' : '👩'}
        </div>
        ${state.isDeviated ? `<div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);
          white-space:nowrap;background:#f43f5e;color:white;font-size:9px;font-weight:800;
          padding:2px 6px;border-radius:6px;box-shadow:0 2px 6px rgba(244,63,94,0.4)">
          +${state.deviationDistanceMeters}m off-route</div>` : ''}
      </div>`,
      className: '', iconSize: [32, 32], iconAnchor: [16, 16],
    });

    if (!travelerMarker.current) {
      travelerMarker.current = L.marker(state.currentCoordinates, { icon, zIndexOffset: 1000 }).addTo(map);
    } else {
      travelerMarker.current.setLatLng(state.currentCoordinates);
      travelerMarker.current.setIcon(icon);
    }
  }, [state.currentCoordinates, riskEvaluation.riskLevel, state.isSosTriggered, state.isDeviated, state.deviationDistanceMeters, isGuardianView]);

  return (
    <div className={`relative w-full ${heightClass}`}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Floating Status Badge */}
      <div className="absolute top-2.5 left-2.5 z-[400] flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-white/60 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-800 shadow-sm pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {isGuardianView ? 'Guardian Live Sync' : 'Corridor Sentinel'}
        </div>
        {state.isDeviated && (
          <div className="flex items-center gap-1 bg-rose-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-sm animate-pulse pointer-events-auto">
            <AlertTriangle className="w-3 h-3" /> Off-route +{state.deviationDistanceMeters}m
          </div>
        )}
      </div>

      {/* Destination Badge */}
      <div className="absolute top-2.5 right-2.5 z-[400] bg-white/95 backdrop-blur-md border border-white/60 px-2.5 py-1.5 rounded-xl text-[11px] shadow-sm pointer-events-none">
        <div className="text-[9px] text-slate-400 font-medium">Destination</div>
        <div className="font-bold text-slate-800 flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 text-purple-600" /> VIT Pune Bibwewadi
        </div>
      </div>

      {/* Controls Bar */}
      {showControls && (
        <div className="absolute bottom-2.5 left-2.5 z-[400] flex flex-wrap gap-1.5">
          <button
            onClick={() => mapInstance.current?.panTo(state.currentCoordinates, { animate: true })}
            className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-white/60 px-2 py-1.5 rounded-xl text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-white transition active:scale-95"
          >
            <Crosshair className="w-3 h-3 text-purple-600" /> Center
          </button>

          <button
            onClick={() => normalPoly.current && mapInstance.current?.fitBounds(normalPoly.current.getBounds(), { padding: [30, 30] })}
            className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-white/60 px-2 py-1.5 rounded-xl text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-white transition active:scale-95"
          >
            <Compass className="w-3 h-3 text-indigo-600" /> Route
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-bold shadow-sm transition active:scale-95 backdrop-blur-md ${
              showHeatmap
                ? 'bg-purple-600 text-white shadow-purple-500/25'
                : 'bg-white/95 text-slate-700 hover:bg-white border border-white/60'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{showHeatmap ? 'Heatmap: ON' : 'Heatmap'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
