import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { GROUPED_STOPS } from '../../services/routeBuilder';
import { SafeTransitMap } from '../Map/SafeTransitMap';
import { RiskScoreHUD } from './RiskScoreHUD';
import { AIExplanationFeed } from './AIExplanationFeed';
import { DemoControlDeck } from './DemoControlDeck';
import { CheckInModal } from './CheckInModal';
import { DiscreetMode } from './DiscreetMode';
import { JourneyTimeline } from './JourneyTimeline';
import { Shield, Battery, Radio, AlertOctagon, Eye, Map, ShieldCheck, Sliders, VolumeX, Siren, MapPin, ArrowUpDown } from 'lucide-react';

type Tab = 'journey' | 'safety' | 'controls';

export const TravelerView: React.FC = () => {
  const {
    state,
    activeRoute,
    allRoutes,
    fromStop,
    toStop,
    setRouteEndpoints,
    swapEndpoints,
    selectRoute,
    triggerManualSos,
    toggleDiscreetMode,
    silenceSiren,
  } = useSafety();
  const [activeTab, setActiveTab] = useState<Tab>('journey');

  const time = `${String(state.simulatedHour).padStart(2, '0')}:${String(state.simulatedMinute).padStart(2, '0')}`;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'journey', label: 'Journey', icon: <Map className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'controls', label: 'Controls', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {state.discreetModeActive && <DiscreetMode />}
      <CheckInModal />

      {/* Phone Frame */}
      <div className="w-full max-w-md glass rounded-[36px] overflow-hidden flex flex-col shadow-2xl">

        {/* ── Status Bar ── */}
        <div className="px-5 py-2.5 flex items-center justify-between glass-sm border-b border-white/10">
          <span className="font-mono font-bold text-main text-xs tracking-wide">{time} IST</span>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-full">
            <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-300">Guardian Linked</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sub">
            <span>5G</span>
            <Battery className={`w-3.5 h-3.5 ${state.batteryLevel < 20 ? 'text-rose-400' : 'text-sub'}`} />
            <span className={state.batteryLevel < 20 ? 'text-rose-400 font-bold' : 'text-sub'}>{state.batteryLevel}%</span>
          </div>
        </div>

        {/* ── App Header ── */}
        <div className="px-4 py-3 flex items-center justify-between glass-sm border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-main" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-main leading-tight tracking-tight">SafeTransit</h2>
              <p className="text-[11px] text-sub font-semibold">Predictive Safety</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDiscreetMode}
              className="p-2 rounded-xl glass-sm hover:bg-white/20 transition"
              title="Camouflage"
            >
              <Eye className="w-4 h-4 text-sub" />
            </button>
            <button
              onClick={() => triggerManualSos('Panic Button Pressed')}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-lg shadow-rose-500/40 flex items-center gap-1.5 transition active:scale-95 glow-rose"
            >
              <AlertOctagon className="w-3.5 h-3.5" /> SOS
            </button>
          </div>
        </div>

        {/* ── Active Siren Reaction Banner ── */}
        {state.isSirenActive && (
          <div className="mx-3 mt-3 bg-rose-600 text-white rounded-2xl p-3.5 shadow-xl animate-pulse flex items-center justify-between gap-2 border border-rose-400">
            <div className="flex items-center gap-2">
              <Siren className="w-5 h-5 animate-bounce text-white shrink-0" />
              <div>
                <div className="text-xs font-black uppercase tracking-wider">EMERGENCY SIREN ACTIVE</div>
                <div className="text-[10px] text-rose-100">Sounding until reaction received</div>
              </div>
            </div>
            <button
              onClick={silenceSiren}
              className="px-3 py-1.5 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs rounded-xl shadow-md flex items-center gap-1 transition active:scale-95 shrink-0"
            >
              <VolumeX className="w-3.5 h-3.5" /> Silence
            </button>
          </div>
        )}

        {/* ── SOS Banner ── */}
        {state.isSosTriggered && !state.isSirenActive && (
          <div className="mx-3 mt-3 bg-rose-500/25 border border-rose-400/40 rounded-2xl p-3 animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-black text-rose-300 uppercase tracking-wide">Silent SOS Dispatched</span>
            </div>
            <p className="text-[11px] text-rose-200/90 leading-snug">{state.sosTriggerReason}</p>
          </div>
        )}

        {/* ── Tab Bar (3 Parts: Journey / Safety / Controls) ── */}
        <div className="px-3.5 py-2.5">
          <div className="flex items-center glass-sm rounded-2xl p-1 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-bold transition-all ${
                  activeTab === tab.id
                    ? 'tab-btn-active shadow-sm'
                    : 'text-sub hover:text-main hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="flex-1 overflow-y-auto px-3.5 pb-4 space-y-3 min-h-0" style={{ maxHeight: 'calc(100vh - 200px)' }}>

          {/* ─── 1. JOURNEY TAB ──────────────────────────────────── */}
          {activeTab === 'journey' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Journey Planner (From ➔ To) Card */}
              <div className="glass rounded-3xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-c font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent-c" /> Plan Journey
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full glass-sm text-sub">
                    {activeRoute.waypoints.length} Stops
                  </span>
                </div>

                {/* From & To Selectors with Swap Button */}
                <div className="relative space-y-2">
                  {/* Starting Point (From) */}
                  <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-2.5 transition focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-300 tracking-wider">From (Starting Point)</label>
                      <select
                        value={fromStop}
                        onChange={(e) => setRouteEndpoints(e.target.value, toStop)}
                        className="w-full bg-transparent text-main font-bold text-xs focus:outline-none cursor-pointer truncate"
                      >
                        {Object.entries(GROUPED_STOPS).map(([corridorId, group]) => (
                          <optgroup key={corridorId} label={group.corridorName} className="bg-white text-gray-900 font-bold">
                            {group.stops.map((stop) => (
                              <option key={`from-${stop.id}`} value={stop.name} className="bg-white text-black font-normal">
                                {stop.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Swap Button Floating in the middle-right */}
                  <div className="flex justify-end pr-3 -my-1 z-10 relative">
                    <button
                      onClick={swapEndpoints}
                      title="Swap Starting Point & Destination"
                      className="w-8 h-8 rounded-full glass-solid border border-white/40 flex items-center justify-center text-accent-c hover:scale-110 active:scale-95 transition-all shadow-md"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Ending Point (To) */}
                  <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-2.5 transition focus-within:border-purple-400/60 focus-within:ring-2 focus-within:ring-purple-400/20">
                    <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-black uppercase text-purple-600 dark:text-purple-300 tracking-wider">To (Destination)</label>
                      <select
                        value={toStop}
                        onChange={(e) => setRouteEndpoints(fromStop, e.target.value)}
                        className="w-full bg-transparent text-main font-bold text-xs focus:outline-none cursor-pointer truncate"
                      >
                        {Object.entries(GROUPED_STOPS).map(([corridorId, group]) => (
                          <optgroup key={corridorId} label={group.corridorName} className="bg-white text-gray-900 font-bold">
                            {group.stops.map((stop) => (
                              <option key={`to-${stop.id}`} value={stop.name} className="bg-white text-black font-normal">
                                {stop.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quick Preset Corridors */}
                <div className="pt-1">
                  <p className="text-[10px] text-muted-c font-semibold mb-1.5">Popular Corridors:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allRoutes.map((r) => {
                      const isSelected = activeRoute.origin === r.origin && activeRoute.destination === r.destination;
                      return (
                        <button
                          key={r.id}
                          onClick={() => selectRoute(r.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400/40'
                              : 'glass-sm text-sub hover:text-main hover:bg-white/20'
                          }`}
                        >
                          {r.origin.split(' ')[0]} ➔ {r.destination.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                  {[
                    { label: 'Distance', value: `${activeRoute.distanceKm} km` },
                    { label: 'Mode', value: activeRoute.transitMode },
                    { label: 'ETA', value: `${activeRoute.estimatedDurationMin} min` },
                  ].map(({ label, value }) => (
                    <div key={label} className="glass-sm rounded-xl py-2 px-1">
                      <p className="text-[9px] text-muted-c font-bold uppercase tracking-wider">{label}</p>
                      <p className="text-xs font-black text-main mt-0.5 truncate">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landmark Step Progress Timeline */}
              <JourneyTimeline />

              {/* High-Resolution Map */}
              <div className="glass-sm rounded-2xl overflow-hidden">
                <SafeTransitMap heightClass="h-[280px]" />
              </div>
            </div>
          )}

          {/* ─── 2. SAFETY TAB ───────────────────────────────────── */}
          {activeTab === 'safety' && (
            <div className="space-y-3 animate-fadeIn">
              <RiskScoreHUD />
              <AIExplanationFeed />
            </div>
          )}

          {/* ─── 3. CONTROLS TAB ─────────────────────────────────── */}
          {activeTab === 'controls' && (
            <div className="animate-fadeIn">
              <DemoControlDeck />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
