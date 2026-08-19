import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { SafeTransitMap } from '../Map/SafeTransitMap';
import { RiskScoreHUD } from './RiskScoreHUD';
import { AIExplanationFeed } from './AIExplanationFeed';
import { DemoControlDeck } from './DemoControlDeck';
import { CheckInModal } from './CheckInModal';
import { DiscreetMode } from './DiscreetMode';
import { JourneyTimeline } from './JourneyTimeline';
import {
  Shield,
  Battery,
  Radio,
  AlertOctagon,
  Eye,
  Bus,
} from 'lucide-react';

export const TravelerView: React.FC = () => {
  const {
    state,
    activeRoute,
    allRoutes,
    selectRoute,
    triggerManualSos,
    toggleDiscreetMode,
  } = useSafety();

  const formattedTime = `${String(state.simulatedHour).padStart(2, '0')}:${String(
    state.simulatedMinute
  ).padStart(2, '0')}`;

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full">
      {/* Discreet Mode Overlay */}
      {state.discreetModeActive && <DiscreetMode />}

      {/* Check-In Modal Overlay */}
      <CheckInModal />

      {/* Mobile Device Mockup Frame */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-[36px] shadow-xl overflow-hidden flex flex-col my-1 transition-all">
        {/* Device Status Bar */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
            <span>{formattedTime}</span>
            <span className="text-[10px] text-slate-400 font-normal">IST</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 shadow-2xs">
            <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
            <span>Guardian Linked</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-slate-400">5G</span>
            <div className="flex items-center gap-1 text-slate-800 font-bold">
              <Battery className={`w-3.5 h-3.5 ${state.batteryLevel < 20 ? 'text-rose-500' : 'text-slate-700'}`} />
              <span>{state.batteryLevel}%</span>
            </div>
          </div>
        </div>

        {/* SafeTransit Traveler App Header */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-sm">
              <Shield className="w-5 h-5 fill-current text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">SafeTransit Passenger</h2>
              <p className="text-[10px] text-slate-500 font-medium">Predictive Safety Guardian</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleDiscreetMode}
              title="Discreet Screen Mode"
              className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs text-xs flex items-center gap-1 transition"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => triggerManualSos('Instant Emergency Panic Button Pressed')}
              title="Emergency SOS Panic Button"
              className="px-3 py-1.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 flex items-center gap-1 transition active:scale-95 animate-pulse"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Scrollable App Body */}
        <div className="p-3.5 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] bg-slate-50/40">
          {/* Preset Route Selector */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-slate-500">Selected Route</span>
              <span className="text-indigo-600 font-bold">Pune Bus Corridor</span>
            </div>

            <select
              value={activeRoute.id}
              onChange={(e) => selectRoute(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none cursor-pointer shadow-2xs"
            >
              {allRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.distanceKm} km • {r.transitMode})
                </option>
              ))}
            </select>

            {/* Route Summary Pill */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Bus className="w-3.5 h-3.5 text-slate-600" />
                <span>{activeRoute.transitMode}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span>📍 {activeRoute.distanceKm} km</span>
                <span>•</span>
                <span>⏱️ {activeRoute.estimatedDurationMin}m ETA</span>
              </div>
            </div>
          </div>

          {/* Emergency SOS Banner (If Active) */}
          {state.isSosTriggered && (
            <div className="bg-rose-50 border border-rose-300 rounded-2xl p-3.5 text-rose-900 shadow-md animate-pulse">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    SILENT SOS AUTO-DISPATCHED
                  </h4>
                  <div className="text-[11px] text-rose-600">
                    Telemetry & evidence bundle transmitted to Guardian Console
                  </div>
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl text-[10px] font-mono text-slate-700 mt-2 border border-rose-200 space-y-1">
                <div>Reason: {state.sosTriggerReason}</div>
                <div>Coordinates: {state.currentCoordinates[0].toFixed(4)}° N, {state.currentCoordinates[1].toFixed(4)}° E</div>
              </div>
            </div>
          )}

          {/* Interactive Landmark Timeline */}
          <JourneyTimeline />

          {/* Interactive Leaflet Map */}
          <SafeTransitMap heightClass="h-[270px]" />

          {/* Live Risk Score HUD */}
          <RiskScoreHUD />

          {/* Explainable AI Reasoning Feed */}
          <AIExplanationFeed />

          {/* Judge Demo Chaos Control Deck */}
          <DemoControlDeck />
        </div>
      </div>
    </div>
  );
};
