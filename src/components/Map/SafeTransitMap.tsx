import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useSafety } from '../../context/SafetyContext';
import { Compass, Crosshair, AlertTriangle, MapPin } from 'lucide-react';

interface SafeTransitMapProps {
  heightClass?: string;
  isGuardianView?: boolean;
  showControls?: boolean;
}

export const SafeTransitMap: React.FC<SafeTransitMapProps> = ({
  heightClass = 'h-[340px]',
  isGuardianView = false,
  showControls = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const travelerMarkerRef = useRef<L.Marker | null>(null);
  const normalPolylineRef = useRef<L.Polyline | null>(null);
  const deviationPolylineRef = useRef<L.Polyline | null>(null);
  const dangerCirclesRef = useRef<L.Circle[]>([]);
  const waypointMarkersRef = useRef<L.Marker[]>([]);

  const { state, activeRoute, riskEvaluation } = useSafety();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = activeRoute.normalPath[0] || [18.5018, 73.8586];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality light tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeRoute]);

  // Update Route Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (normalPolylineRef.current) normalPolylineRef.current.remove();
    if (deviationPolylineRef.current) deviationPolylineRef.current.remove();
    dangerCirclesRef.current.forEach((c) => c.remove());
    dangerCirclesRef.current = [];
    waypointMarkersRef.current.forEach((w) => w.remove());
    waypointMarkersRef.current = [];

    // 1. Planned Corridor (Emerald Green with clean weight)
    const normalPolyline = L.polyline(activeRoute.normalPath, {
      color: '#059669',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    normalPolylineRef.current = normalPolyline;

    // 2. Deviation Route (Vibrant Rose/Red)
    if (activeRoute.deviationPath && activeRoute.deviationPath.length > 0) {
      const devPolyline = L.polyline(activeRoute.deviationPath, {
        color: state.isDeviated ? '#e11d48' : '#cbd5e1',
        weight: state.isDeviated ? 5 : 3,
        opacity: state.isDeviated ? 0.95 : 0.5,
        dashArray: '6, 8',
      }).addTo(map);
      deviationPolylineRef.current = devPolyline;
    }

    // 3. Danger Hazard Circles
    activeRoute.dangerZones.forEach((zone) => {
      const circle = L.circle(zone.center, {
        radius: zone.radiusMeters,
        color: '#e11d48',
        fillColor: '#e11d48',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 6',
      }).addTo(map);

      circle.bindTooltip(`⚠️ ${zone.name}`, {
        permanent: false,
        direction: 'top',
        className: 'bg-white text-slate-800 text-xs font-semibold border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-lg',
      });

      dangerCirclesRef.current.push(circle);
    });

    // 4. Waypoint Markers
    activeRoute.waypoints.forEach((wp, idx) => {
      const isStart = idx === 0;
      const isEnd = idx === activeRoute.waypoints.length - 1;

      const markerHtml = `
        <div class="flex items-center justify-center w-7 h-7 rounded-full shadow-md font-bold text-xs bg-white border border-slate-200 text-slate-800 ${
          isStart
            ? 'ring-4 ring-emerald-100 text-emerald-700 font-black'
            : isEnd
            ? 'ring-4 ring-indigo-100 text-indigo-700 font-black'
            : 'text-[10px] text-slate-600'
        }">
          ${isStart ? '🚩' : isEnd ? '🏁' : idx}
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-waypoint-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([wp.lat, wp.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div class="text-xs p-1 text-slate-800 font-sans">
          <div class="font-bold text-slate-900 mb-0.5">${wp.name}</div>
          <div class="text-slate-500 text-[11px]">${wp.landmark || ''}</div>
          <div class="mt-1 flex gap-1.5 items-center text-[10px] text-slate-600 font-medium">
            <span>⏱️ +${wp.estimatedTimeMin} min</span>
            <span>•</span>
            <span>💡 ${wp.lightingQuality} lighting</span>
          </div>
        </div>
      `);
      waypointMarkersRef.current.push(marker);
    });

    map.fitBounds(normalPolyline.getBounds(), { padding: [35, 35] });
  }, [activeRoute, state.isDeviated]);

  // Update Moving Traveler Marker Position
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const coords = state.currentCoordinates;
    const isCritical = riskEvaluation.riskLevel === 'critical' || state.isSosTriggered;
    const isCaution = riskEvaluation.riskLevel === 'caution';

    const bgClass = isCritical
      ? 'bg-rose-500 ring-rose-200'
      : isCaution
      ? 'bg-amber-500 ring-amber-200'
      : 'bg-emerald-600 ring-emerald-200';

    const avatarHtml = `
      <div class="relative flex items-center justify-center">
        <div class="relative w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white ring-4 transition-all duration-300 ${bgClass}">
          ${isCritical ? '🚨' : isGuardianView ? '🛡️' : '👩'}
        </div>
        ${
          state.isDeviated
            ? `<div class="absolute -top-6 whitespace-nowrap bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">Off-Path ${state.deviationDistanceMeters}m</div>`
            : ''
        }
      </div>
    `;

    const icon = L.divIcon({
      html: avatarHtml,
      className: 'custom-traveler-avatar',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (!travelerMarkerRef.current) {
      travelerMarkerRef.current = L.marker(coords, { icon, zIndexOffset: 1000 }).addTo(map);
    } else {
      travelerMarkerRef.current.setLatLng(coords);
      travelerMarkerRef.current.setIcon(icon);
    }
  }, [
    state.currentCoordinates,
    riskEvaluation.riskLevel,
    state.isSosTriggered,
    state.isDeviated,
    state.deviationDistanceMeters,
    isGuardianView,
  ]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(state.currentCoordinates, { animate: true });
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current && normalPolylineRef.current) {
      mapInstanceRef.current.fitBounds(normalPolylineRef.current.getBounds(), { padding: [35, 35] });
    }
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left Status Badge */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-slate-800">
            {isGuardianView ? 'Guardian Radar Sync' : 'Live Corridor Watch'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500 font-medium">Pune Satara Rd</span>
        </div>

        {state.isDeviated && (
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-sm animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Off-Corridor Anomaly: +{state.deviationDistanceMeters}m</span>
          </div>
        )}
      </div>

      {/* Floating Action Controls */}
      {showControls && (
        <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-1.5">
          <button
            onClick={handleRecenter}
            className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
            <span>Center</span>
          </button>
          <button
            onClick={handleFitRoute}
            className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Full Route</span>
          </button>
        </div>
      )}

      {/* Destination Tag */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl text-right shadow-sm pointer-events-none">
        <div className="text-[10px] text-slate-400 font-medium">Destination</div>
        <div className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end">
          <MapPin className="w-3 h-3 text-indigo-600" />
          <span>VIT Pune Campus</span>
        </div>
      </div>
    </div>
  );
};
