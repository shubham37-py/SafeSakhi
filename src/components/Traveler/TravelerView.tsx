import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { SafeTransitMap } from '../Map/SafeTransitMap';
import { RiskScoreHUD } from './RiskScoreHUD';
import { AIExplanationFeed } from './AIExplanationFeed';
import { DemoControlDeck } from './DemoControlDeck';
import { CheckInModal } from './CheckInModal';
import { DiscreetMode } from './DiscreetMode';
import { JourneyTimeline } from './JourneyTimeline';
import { Shield, Battery, Radio, AlertOctagon, Eye } from 'lucide-react';

export const TravelerView: React.FC = () => {
  const { state, activeRoute, allRoutes, selectRoute, triggerManualSos, toggleDiscreetMode } = useSafety();

  const time = `${String(state.simulatedHour).padStart(2, '0')}:${String(state.simulatedMinute).padStart(2, '0')}`;

  return (
    <div className="w-full flex flex-col items-center">
      {state.discreetModeActive && <DiscreetMode />}
      <CheckInModal />

      {/* Phone Frame */}
      <div className="w-full max-w-md glass rounded-[32px] overflow-hidden flex flex-col">

        {/* Status Bar */}
        <div className="px-5 py-2 flex items-center justify-between text-[11px] bg-white/5 border-b border-white/10">
          <span className="font-mono font-bold text-white">{time} IST</span>
          <div className="flex items-center gap-1.5 bg-emerald-400/15 border border-emerald-400/25 px-2 py-0.5 rounded-full text-emerald-300 text-[10px] font-bold">
            <Radio className="w-2.5 h-2.5 animate-pulse" /> Guardian Linked
          </div>
          <div className="flex items-center gap-1.5 font-mono text-white/60">
            <span>5G</span>
            <Battery className={`w-3.5 h-3.5 ${state.batteryLevel < 20 ? 'text-rose-400' : 'text-white/60'}`} />
            <span className={state.batteryLevel < 20 ? 'text-rose-300 font-bold' : ''}>{state.batteryLevel}%</span>
          </div>
        </div>

        {/* App Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">SafeTransit</h2>
              <p className="text-[10px] text-white/50">Predictive Safety</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDiscreetMode}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition"
              title="Camouflage Mode"
            >
              <Eye className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={() => triggerManualSos('Panic Button Pressed')}
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/30 flex items-center gap-1 transition active:scale-95 glow-rose"
            >
              <AlertOctagon className="w-3.5 h-3.5" /> SOS
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          {/* Route Selector */}
          <div className="glass-sm rounded-2xl p-3">
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-1.5">Active Route</p>
            <select
              value={activeRoute.id}
              onChange={(e) => selectRoute(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white font-semibold rounded-xl p-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/50 cursor-pointer"
            >
              {allRoutes.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-800 text-white">
                  {r.title} · {r.distanceKm}km · {r.transitMode}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] text-white/40">
              <span>🚌 {activeRoute.transitMode}</span>
              <span>📍 {activeRoute.distanceKm} km</span>
              <span>⏱️ {activeRoute.estimatedDurationMin} min ETA</span>
            </div>
          </div>

          {/* SOS Active Banner */}
          {state.isSosTriggered && (
            <div className="bg-rose-500/20 border border-rose-500/40 rounded-2xl p-3 animate-pulse">
              <div className="flex items-center gap-2 mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-300" />
                <span className="text-xs font-bold text-rose-200 uppercase tracking-wide">Silent SOS Dispatched</span>
              </div>
              <p className="text-[10px] text-rose-300/80 mb-2">{state.sosTriggerReason}</p>
              <div className="bg-white/5 rounded-xl p-2 text-[10px] font-mono text-white/50 space-y-0.5">
                <div>{state.currentCoordinates[0].toFixed(5)}° N, {state.currentCoordinates[1].toFixed(5)}° E</div>
              </div>
            </div>
          )}

          {/* Journey Timeline */}
          <JourneyTimeline />

          {/* Map */}
          <div className="glass-sm rounded-2xl overflow-hidden">
            <SafeTransitMap heightClass="h-[250px]" />
          </div>

          {/* Risk HUD */}
          <RiskScoreHUD />

          {/* AI Feed */}
          <AIExplanationFeed />

          {/* Demo Controls */}
          <DemoControlDeck />
        </div>
      </div>
    </div>
  );
};
