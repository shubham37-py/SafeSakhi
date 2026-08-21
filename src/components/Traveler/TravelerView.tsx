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
import {
  Shield,
  Battery,
  Radio,
  AlertOctagon,
  Eye,
  Map,
  ShieldCheck,
  Sliders,
  VolumeX,
  Siren,
  Smartphone,
} from 'lucide-react';
import ShakeDetector from '../ShakeDetector/ShakeDetector';

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
  const [shakeEnabled, setShakeEnabled] = useState(false);

  // Enable motion sensor permission and shake detection
  const enableShakeDetection = async () => {
    try {
      const motionEvent = DeviceMotionEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof motionEvent.requestPermission === 'function') {
        const permission = await motionEvent.requestPermission();

        if (permission !== 'granted') {
          alert('Motion permission was denied');
          return;
        }
      }

      setShakeEnabled(true);
    } catch (error) {
      console.error('Could not enable shake detection:', error);
      alert('Could not enable shake detection');
    }
  };

  const time = `${String(state.simulatedHour).padStart(2, '0')}:${String(
    state.simulatedMinute
  ).padStart(2, '0')}`;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'journey', label: 'Journey', icon: <Map className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'controls', label: 'Controls', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {state.discreetModeActive && <DiscreetMode />}
      <CheckInModal />

      {/* Shake Detection */}
      <ShakeDetector
        enabled={shakeEnabled}
        onShake={() => {
          if (!state.isSosTriggered) {
            triggerManualSos('Emergency shake gesture detected');
          }
        }}
      />

      {/* Phone Frame */}
      <div className="w-full max-w-md glass rounded-[36px] overflow-hidden flex flex-col shadow-2xl">

        {/* ── Status Bar ── */}
        <div className="px-5 py-2.5 flex items-center justify-between glass-sm border-b border-white/10">
          <span className="font-mono font-bold text-main text-xs tracking-wide">
            {time} IST
          </span>

          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-full">
            <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-300">
              Guardian Linked
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sub">
            <span>5G</span>

            <Battery
              className={`w-3.5 h-3.5 ${
                state.batteryLevel < 20 ? 'text-rose-400' : 'text-sub'
              }`}
            />

            <span
              className={
                state.batteryLevel < 20
                  ? 'text-rose-400 font-bold'
                  : 'text-sub'
              }
            >
              {state.batteryLevel}%
            </span>
          </div>
        </div>

        {/* ── App Header ── */}
        <div className="px-4 py-3 flex items-center justify-between glass-sm border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-main" />
            </div>

            <div>
              <h2 className="text-[15px] font-black text-main leading-tight tracking-tight">
                SafeTransit
              </h2>

              <p className="text-[11px] text-sub font-semibold">
                Predictive Safety
              </p>
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
              <AlertOctagon className="w-3.5 h-3.5" />
              SOS
            </button>
          </div>
        </div>

        {/* ── Active Siren Reaction Banner ── */}
        {state.isSirenActive && (
          <div className="mx-3 mt-3 bg-rose-600 text-white rounded-2xl p-3.5 shadow-xl animate-pulse flex items-center justify-between gap-2 border border-rose-400">
            <div className="flex items-center gap-2">
              <Siren className="w-5 h-5 animate-bounce text-white shrink-0" />

              <div>
                <div className="text-xs font-black uppercase tracking-wider">
                  EMERGENCY SIREN ACTIVE
                </div>

                <div className="text-[10px] text-rose-100">
                  Sounding until reaction received
                </div>
              </div>
            </div>

            <button
              onClick={silenceSiren}
              className="px-3 py-1.5 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs rounded-xl shadow-md flex items-center gap-1 transition active:scale-95 shrink-0"
            >
              <VolumeX className="w-3.5 h-3.5" />
              Silence
            </button>
          </div>
        )}

        {/* ── SOS Banner ── */}
        {state.isSosTriggered && !state.isSirenActive && (
          <div className="mx-3 mt-3 bg-rose-500/25 border border-rose-400/40 rounded-2xl p-3 animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <AlertOctagon className="w-4 h-4 text-rose-400" />

              <span className="text-xs font-black text-rose-300 uppercase tracking-wide">
                Silent SOS Dispatched
              </span>
            </div>

            <p className="text-[11px] text-rose-200/90 leading-snug">
              {state.sosTriggerReason}
            </p>
          </div>
        )}

        {/* ── Tab Bar ── */}
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
        <div
          className="flex-1 overflow-y-auto px-3.5 pb-4 space-y-3 min-h-0"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >

          {/* ─── JOURNEY TAB ─── */}
          {activeTab === 'journey' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Route Selector Card */}
              <div className="glass rounded-2xl p-3.5">
                <p className="text-[11px] text-muted-c font-bold uppercase tracking-widest mb-2">Active Route</p>
                <select
                  value={activeRoute.id}
                  onChange={(e) => selectRoute(e.target.value)}
                  className="w-full glass-sm border border-white/25 text-main font-bold rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 cursor-pointer mb-2.5"
                >
                  {allRoutes.map((r) => (
                    <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                      {r.title}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    {
                      label: 'Distance',
                      value: `${activeRoute.distanceKm} km`
                    },
                    {
                      label: 'Mode',
                      value: activeRoute.transitMode
                    },
                    {
                      label: 'ETA',
                      value: `${activeRoute.estimatedDurationMin} min`
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="glass-sm rounded-xl py-2 px-1"
                    >
                      <p className="text-[9px] text-muted-c font-bold uppercase tracking-wider">
                        {label}
                      </p>

                      <p className="text-xs font-black text-main mt-0.5 truncate">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <JourneyTimeline />

              <div className="glass-sm rounded-2xl overflow-hidden">
                <SafeTransitMap heightClass="h-[280px]" />
              </div>
            </div>
          )}

          {/* ─── SAFETY TAB ─── */}
          {activeTab === 'safety' && (
            <div className="space-y-3 animate-fadeIn">

              {/* Shake Detection Card */}
              <div className="glass rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-rose-400" />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-main">
                        Shake to Alert
                      </h3>

                      <p className="text-[10px] text-sub mt-0.5">
                        Shake your phone firmly to trigger SOS
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={enableShakeDetection}
                    disabled={shakeEnabled}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition active:scale-95 ${
                      shakeEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                    }`}
                  >
                    {shakeEnabled ? 'Enabled' : 'Enable'}
                  </button>
                </div>

                {shakeEnabled && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-300 font-semibold">
                      Shake detection is active
                    </span>
                  </div>
                )}
              </div>

              <RiskScoreHUD />
              <AIExplanationFeed />
            </div>
          )}

          {/* ─── CONTROLS TAB ─── */}
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