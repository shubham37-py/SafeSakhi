import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { MapPin } from 'lucide-react';

export const JourneyTimeline: React.FC = () => {
  const { activeRoute, state } = useSafety();
  const currentIndex = Math.min(
    activeRoute.waypoints.length - 1,
    Math.floor(state.progressFraction * activeRoute.waypoints.length)
  );
  const eta = Math.max(2, Math.round((1 - state.progressFraction) * activeRoute.estimatedDurationMin));

  return (
    <div className="glass rounded-3xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-purple-300" />
          <span className="text-sm font-bold text-white">Route Progress</span>
        </div>
        <span className="text-xs text-white/50 font-semibold">ETA <span className="text-purple-300 font-bold">{eta} min</span></span>
      </div>

      {/* Step Track */}
      <div className="relative flex items-center justify-between mb-3">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/15 -translate-y-1/2 z-0 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-emerald-400 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
          style={{ width: `${state.progressFraction * 100}%` }}
        />
        {activeRoute.waypoints.map((_, idx) => {
          const passed = idx <= currentIndex;
          const current = idx === currentIndex;
          return (
            <div key={idx} className="relative z-10">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300 ${
                current
                  ? 'bg-purple-400 text-white ring-4 ring-purple-400/30 scale-110'
                  : passed
                  ? 'bg-emerald-400 text-white'
                  : 'bg-white/15 border border-white/25 text-white/40'
              }`}>
                {passed && !current ? '✓' : idx + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Stop */}
      <div className="glass-sm rounded-xl px-3 py-2 flex items-center justify-between text-xs">
        <span className="text-white/60">📍 {activeRoute.waypoints[currentIndex]?.name || '—'}</span>
        <span className="text-white/40 font-mono text-[10px]">{currentIndex + 1} / {activeRoute.waypoints.length}</span>
      </div>
    </div>
  );
};
