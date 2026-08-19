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
      icon: <Navigation className="w-4 h-4" />,
      active: state.isDeviated,
      activeColor: 'bg-rose-500/25 border-rose-400/40 text-rose-200',
      onClick: () => triggerRouteDeviation(),
    },
    {
      label: 'Sudden Stop',
      sublabel: 'Off-schedule halt',
      icon: <Timer className="w-4 h-4" />,
      active: state.isStoppedUnusually,
      activeColor: 'bg-amber-500/25 border-amber-400/40 text-amber-200',
      onClick: () => triggerUnusualStop(),
    },
    {
      label: 'Check-In',
      sublabel: '10s countdown',
      icon: <Radio className="w-4 h-4" />,
      active: false,
      activeColor: '',
      onClick: () => triggerCheckIn(),
    },
    {
      label: 'Low Battery',
      sublabel: `${state.batteryLevel <= 10 ? 'Tap to restore' : 'Drain to 8%'}`,
      icon: <BatteryCharging className="w-4 h-4" />,
      active: state.batteryLevel <= 10,
      activeColor: 'bg-rose-500/20 border-rose-400/30 text-rose-200',
      onClick: () => setBatteryLevel(state.batteryLevel <= 10 ? 75 : 8),
    },
    {
      label: 'Night Mode',
      sublabel: `${state.simulatedHour >= 22 ? '2PM →' : '11PM ↑'}`,
      icon: <Moon className="w-4 h-4" />,
      active: state.simulatedHour >= 22,
      activeColor: 'bg-indigo-500/20 border-indigo-400/30 text-indigo-200',
      onClick: () => setSimulatedTime(state.simulatedHour >= 22 ? 14 : 23, 45),
    },
    {
      label: 'Force SOS',
      sublabel: 'Emergency dispatch',
      icon: <AlertTriangle className="w-4 h-4" />,
      active: state.isSosTriggered,
      activeColor: 'bg-rose-500/30 border-rose-400/50 text-rose-100',
      onClick: () => triggerManualSos('Stage Demo: Direct SOS Escalation'),
    },
  ];

  return (
    <div className="glass rounded-3xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-300" />
          <span className="text-sm font-bold text-white">Demo Controls</span>
          <span className="text-[9px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-semibold border border-white/15">Pitch Mode</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[11px] text-white/50 hover:text-white/80 transition font-semibold"
        >
          {collapsed ? 'Show' : 'Hide'}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {scenarios.map((s) => (
              <button
                key={s.label}
                onClick={s.onClick}
                className={`text-left p-3 rounded-2xl border transition-all ${
                  s.active && s.activeColor
                    ? s.activeColor
                    : 'glass-sm text-white/70 hover:bg-white/15 hover:text-white'
                }`}
              >
                <div className={`mb-1.5 ${s.active ? '' : 'opacity-70'}`}>{s.icon}</div>
                <div className="text-xs font-bold leading-tight">{s.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{s.sublabel}</div>
              </button>
            ))}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <button
                onClick={togglePlayPause}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition"
              >
                {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {state.isPlaying ? 'Pause' : 'Play'}
              </button>

              <div className="flex gap-0.5 bg-white/10 rounded-xl p-0.5 border border-white/15">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                      state.playbackSpeed === spd ? 'bg-white text-slate-900' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleDiscreetMode}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl glass-sm text-white/60 hover:text-white text-[11px] font-semibold transition"
              >
                <Eye className="w-3.5 h-3.5" /> Camouflage
              </button>
              <button
                onClick={resetJourney}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl glass-sm text-white/60 hover:text-white text-[11px] font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
