import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import {
  Wand2,
  Navigation,
  Timer,
  AlertTriangle,
  BatteryCharging,
  Moon,
  RotateCcw,
  Play,
  Pause,
  Eye,
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';

export const DemoControlDeck: React.FC = () => {
  const {
    state,
    togglePlayPause,
    setPlaybackSpeed,
    triggerRouteDeviation,
    triggerUnusualStop,
    triggerCheckIn,
    setBatteryLevel,
    setSimulatedTime,
    triggerManualSos,
    resetJourney,
    toggleDiscreetMode,
    soundEnabled,
    setSoundEnabled,
  } = useSafety();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/90 border border-white shadow-xs text-slate-700">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Demo Scenario Controls</span>
              <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md font-semibold">
                Pitch Mode
              </span>
            </h4>
            <div className="text-[10px] text-slate-500">
              One-click triggers for live pitch demonstration
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
            className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-600 text-xs transition border border-white shadow-2xs backdrop-blur-md"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-white/80 hover:bg-white rounded-xl border border-white shadow-2xs backdrop-blur-md"
          >
            {isCollapsed ? 'Show Controls' : 'Hide'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-2.5">
          {/* Quick Scenario Triggers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* 1. Wrong Turn */}
            <button
              onClick={() => triggerRouteDeviation()}
              className={`p-2.5 rounded-2xl border text-left transition-all backdrop-blur-md ${
                state.isDeviated
                  ? 'bg-rose-50/90 border-rose-200 text-rose-900 shadow-sm ring-1 ring-rose-200'
                  : 'bg-white/70 hover:bg-white border-white/80 text-slate-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Navigation className={`w-3.5 h-3.5 ${state.isDeviated ? 'text-rose-600 animate-spin' : 'text-slate-700'}`} />
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${state.isDeviated ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
                  {state.isDeviated ? 'ACTIVE' : 'TEST'}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">Wrong Turn</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Veer 380m into bylane</div>
            </button>

            {/* 2. Unexpected Stop */}
            <button
              onClick={() => triggerUnusualStop()}
              className={`p-2.5 rounded-2xl border text-left transition-all backdrop-blur-md ${
                state.isStoppedUnusually
                  ? 'bg-amber-50/90 border-amber-200 text-amber-900 shadow-sm ring-1 ring-amber-200'
                  : 'bg-white/70 hover:bg-white border-white/80 text-slate-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Timer className={`w-3.5 h-3.5 ${state.isStoppedUnusually ? 'text-amber-600 animate-pulse' : 'text-slate-700'}`} />
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${state.isStoppedUnusually ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-600'}`}>
                  {state.isStoppedUnusually ? 'STOPPED' : 'TEST'}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">Abnormal Halt</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Off-schedule delay</div>
            </button>

            {/* 3. Safety Check-In */}
            <button
              onClick={() => triggerCheckIn()}
              className="p-2.5 rounded-2xl border bg-white/70 hover:bg-white border-white/80 text-slate-800 text-left transition shadow-2xs backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-1">
                <Radio className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md">
                  PROMPT
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">"Are You OK?"</div>
              <div className="text-[10px] text-slate-500 mt-0.5">10s check-in prompt</div>
            </button>

            {/* 4. Drain Battery */}
            <button
              onClick={() => setBatteryLevel(state.batteryLevel <= 10 ? 75 : 8)}
              className="p-2.5 rounded-2xl border bg-white/70 hover:bg-white border-white/80 text-slate-800 text-left transition shadow-2xs backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-1">
                <BatteryCharging className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-[9px] font-mono bg-slate-100 text-slate-700 px-1 rounded-md">
                  {state.batteryLevel}%
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">Low Battery</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Drain to 8%</div>
            </button>

            {/* 5. Night Shift */}
            <button
              onClick={() => setSimulatedTime(state.simulatedHour >= 22 ? 14 : 23, 45)}
              className="p-2.5 rounded-2xl border bg-white/70 hover:bg-white border-white/80 text-slate-800 text-left transition shadow-2xs backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-1">
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-[9px] font-mono bg-slate-100 text-slate-700 px-1 rounded-md">
                  {String(state.simulatedHour).padStart(2, '0')}:{String(state.simulatedMinute).padStart(2, '0')}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">Night Transit</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Toggle 2 PM ↔ 11 PM</div>
            </button>

            {/* 6. Instant SOS */}
            <button
              onClick={() => triggerManualSos('Stage Demo: Direct Silent Auto-SOS Escalation')}
              className="p-2.5 rounded-2xl border bg-rose-50/80 hover:bg-rose-100/90 border-rose-200 text-rose-900 text-left transition shadow-2xs backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span className="text-[9px] font-bold bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded-md">
                  TEST SOS
                </span>
              </div>
              <div className="text-xs font-bold text-rose-900">Trigger Auto-SOS</div>
              <div className="text-[10px] text-rose-700/80 mt-0.5">Dispatch evidence</div>
            </button>
          </div>

          {/* Controls Bar */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={togglePlayPause}
                className="px-3.5 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{state.isPlaying ? 'Pause' : 'Resume'}</span>
              </button>

              <div className="flex items-center bg-white/70 backdrop-blur-md rounded-2xl p-0.5 border border-white/90 shadow-2xs">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2.5 py-0.5 text-[11px] font-mono rounded-xl font-bold transition ${
                      state.playbackSpeed === spd
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
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
                className="px-3 py-1.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 text-[11px] font-semibold border border-white shadow-2xs flex items-center gap-1 transition backdrop-blur-md"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Camouflage</span>
              </button>

              <button
                onClick={resetJourney}
                className="px-3 py-1.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 text-[11px] font-semibold border border-white shadow-2xs flex items-center gap-1 transition backdrop-blur-md"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
