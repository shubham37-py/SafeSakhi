import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { MapPin } from 'lucide-react';

export const JourneyTimeline: React.FC = () => {
  const { activeRoute, state } = useSafety();

  const currentIndex = Math.min(
    activeRoute.waypoints.length - 1,
    Math.floor(state.progressFraction * activeRoute.waypoints.length)
  );

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
      <div className="flex items-center justify-between text-[11px] mb-2 font-semibold">
        <span className="text-slate-600 uppercase tracking-wider text-[10px]">Route Progress</span>
        <span className="text-indigo-600">
          ETA: {Math.max(2, Math.round((1 - state.progressFraction) * activeRoute.estimatedDurationMin))} mins
        </span>
      </div>

      {/* Horizontal Waypoint Bar */}
      <div className="relative flex items-center justify-between">
        {/* Progress Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
          style={{ width: `${state.progressFraction * 100}%` }}
        />

        {activeRoute.waypoints.map((_, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 scale-110 shadow-sm'
                    : isPassed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-400'
                }`}
              >
                {isPassed && !isCurrent ? '✓' : idx + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Landmark Name */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1 text-slate-700 font-semibold truncate">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Near {activeRoute.waypoints[currentIndex]?.name || 'Satara Road'}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono shrink-0">
          Step {currentIndex + 1} of {activeRoute.waypoints.length}
        </span>
      </div>
    </div>
  );
};
