import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Navigation, Timer, Radio, BatteryCharging, Moon, AlertTriangle, Play, Pause, RotateCcw, Eye, Wand2 } from 'lucide-react';

export const DemoControlDeck: React.FC = () => {
  const {
    state, togglePlayPause, setPlaybackSpeed,
    triggerRouteDeviation, triggerUnusualStop, triggerCheckIn,
    setBatteryLevel, setSimulatedTime, triggerManualSos,
    resetJourney, toggleDiscreetMode,
  } = useSafety();

  const [collapsed, setCollapsed] = useState(false);

  const scenarios = [
    {
      label: 'Wrong Turn',
      sublabel: '380m into bylane',
      emoji: '↪️',
      icon: <Navigation className="w-4 h-4" />,
      active: state.isDeviated,
      activeStyle: 'bg-rose-500/25 border-rose-400/50 text-rose-600 dark:text-rose-200',
      onClick: () => triggerRouteDeviation(),
    },
    {
      label: 'Sudden Stop',
      sublabel: 'Off-schedule halt',
      emoji: '⛔',
      icon: <Timer className="w-4 h-4" />,
      active: state.isStoppedUnusually,
      activeStyle: 'bg-amber-500/25 border-amber-400/50 text-amber-600 dark:text-amber-200',
      onClick: () => triggerUnusualStop(),
    },
    {
      label: 'Check-In',
      sublabel: '10s countdown',
      emoji: '🔔',
      icon: <Radio className="w-4 h-4" />,
      active: false,
      activeStyle: '',
      onClick: () => triggerCheckIn(),
    },
    {
      label: 'Low Battery',
      sublabel: state.batteryLevel <= 10 ? 'Tap to restore' : 'Drain to 8%',
      emoji: '🪫',
      icon: <BatteryCharging className="w-4 h-4" />,
      active: state.batteryLevel <= 10,
      activeStyle: 'bg-rose-500/20 border-rose-400/40 text-rose-600 dark:text-rose-200',
      onClick: () => setBatteryLevel(state.batteryLevel <= 10 ? 75 : 8),
    },
    {
      label: 'Night Mode',
      sublabel: state.simulatedHour >= 22 ? '→ Switch 2 PM' : '→ Switch 11 PM',
      emoji: '🌙',
      icon: <Moon className="w-4 h-4" />,
      active: state.simulatedHour >= 22,
      activeStyle: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-600 dark:text-indigo-200',
      onClick: () => setSimulatedTime(state.simulatedHour >= 22 ? 14 : 23, 45),
    },
    {
      label: 'Force SOS',
      sublabel: 'Emergency dispatch',
      emoji: '🚨',
      icon: <AlertTriangle className="w-4 h-4" />,
      active: state.isSosTriggered,
      activeStyle: 'bg-rose-500/30 border-rose-400/60 text-rose-600 dark:text-rose-100',
      onClick: () => triggerManualSos('Stage Demo: Direct SOS Escalation'),
    },
  ];

  return (
    <div className="glass rounded-3xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Wand2 className="w-5 h-5 text-accent-c" />
          <div>
            <span className="text-base font-black text-main">Demo Controls</span>
            <p className="text-[11px] text-sub font-semibold mt-0">One-click scenario triggers for pitch</p>
          </div>
        </div>
        <button onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-sub hover:text-main font-bold glass-sm px-3 py-1.5 rounded-xl transition">
          {collapsed ? 'Show' : 'Hide'}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Scenario Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {scenarios.map((s) => (
              <button
                key={s.label}
                onClick={s.onClick}
                className={`text-left p-3.5 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  s.active && s.activeStyle
                    ? s.activeStyle
                    : 'glass-sm text-sub hover:bg-white/20 hover:text-main border-white/20'
                }`}
              >
                <div className="text-lg mb-1.5">{s.emoji}</div>
                <div className="text-sm font-black leading-tight text-main">{s.label}</div>
                <div className="text-[11px] mt-0.5 text-sub font-semibold">{s.sublabel}</div>
              </button>
            ))}
          </div>

          {/* Playback Row */}
          <div className="pt-4 border-t border-white/12 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button onClick={togglePlayPause}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-main text-sm font-black transition border border-white/20">
                {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {state.isPlaying ? 'Pause' : 'Play'}
              </button>

              <div className="flex gap-0.5 glass-sm rounded-xl p-1 border border-white/15">
                {[1, 2, 4].map((spd) => (
                  <button key={spd} onClick={() => setPlaybackSpeed(spd)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black font-mono transition ${
                      state.playbackSpeed === spd
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-sub hover:text-main'
                    }`}>
                    {spd}×
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleDiscreetMode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-sm text-sub hover:text-main text-xs font-bold transition">
                <Eye className="w-3.5 h-3.5" /> Hide
              </button>
              <button onClick={resetJourney}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-sm text-sub hover:text-main text-xs font-bold transition">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
