import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, Zap, Battery, Clock, Info } from 'lucide-react';

export const RiskScoreHUD: React.FC = () => {
  const { riskEvaluation, state } = useSafety();
  const [showFormula, setShowFormula] = useState(false);

  const score = riskEvaluation.totalRisk;
  const level = riskEvaluation.riskLevel;

  const theme =
    level === 'critical' || state.isSosTriggered
      ? { ring: '#f43f5e', badge: 'bg-rose-500/20 text-rose-500 border-rose-400/40', scoreColor: 'text-rose-500', icon: <ShieldAlert className="w-5 h-5 text-rose-500" />, label: 'High Risk' }
      : level === 'caution'
      ? { ring: '#f59e0b', badge: 'bg-amber-500/20 text-amber-600 border-amber-400/40', scoreColor: 'text-amber-500', icon: <ShieldAlert className="w-5 h-5 text-amber-500" />, label: 'Caution' }
      : { ring: '#10b981', badge: 'bg-emerald-500/20 text-emerald-600 border-emerald-400/40', scoreColor: 'text-main', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, label: 'Safe' };

  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="glass rounded-3xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          {theme.icon}
          <span className="text-base font-black text-main">Safety Score</span>
        </div>
        <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${theme.badge}`}>
          {theme.label}
        </span>
      </div>

      {/* Ring + Metrics side by side */}
      <div className="flex items-center gap-5">
        {/* Score Ring */}
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke="rgba(150,150,150,0.15)" strokeWidth="9" fill="none" />
            <circle cx="50" cy="50" r={radius}
              stroke={theme.ring} strokeWidth="9"
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round" fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black font-mono leading-none ${theme.scoreColor}`}>{score}</span>
            <span className="text-[10px] text-muted-c font-bold uppercase tracking-wider mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Metric Rows */}
        <div className="flex-1 space-y-2">
          {[
            {
              icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
              label: 'Route Path',
              value: state.isDeviated ? `+${state.deviationDistanceMeters}m off` : 'On Corridor',
              alert: state.isDeviated,
            },
            {
              icon: <Clock className="w-3.5 h-3.5 text-sky-500" />,
              label: 'Movement',
              value: state.isStoppedUnusually ? `Stopped ${state.unusualStopDurationSec}s` : 'Moving',
              alert: state.isStoppedUnusually,
            },
            {
              icon: <Battery className="w-3.5 h-3.5 text-emerald-500" />,
              label: 'Battery',
              value: `${state.batteryLevel}%`,
              alert: state.batteryLevel < 20,
            },
          ].map(({ icon, label, value, alert }) => (
            <div key={label} className="glass-sm rounded-xl px-3 py-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sub text-xs font-semibold">
                {icon} {label}
              </span>
              <span className={`text-xs font-black ${alert ? 'text-rose-500' : 'text-main'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Formula */}
      <div className="mt-4 pt-4 border-t border-white/12">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="w-full flex items-center justify-between text-xs text-sub hover:text-main transition font-semibold"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> How the AI calculates this
          </span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFormula && (
          <div className="mt-3 glass-sm rounded-2xl p-4 space-y-3 animate-fadeIn">
            <p className="text-[11px] font-mono text-sub bg-white/10 p-2.5 rounded-xl leading-relaxed border border-white/10">
              Risk = 0.30×Dev + 0.20×Stop + 0.15×Time + 0.10×Crowd + 0.10×Batt + 0.15×Response
            </p>
            <div className="space-y-2">
              {[
                ['Route Deviation', riskEvaluation.weightedBreakdown.routeDeviation, 30],
                ['Unusual Stop', riskEvaluation.weightedBreakdown.unusualStop, 20],
                ['Time of Day', riskEvaluation.weightedBreakdown.timeOfDay, 15],
                ['Crowd / Isolation', riskEvaluation.weightedBreakdown.crowdDensity, 10],
                ['Battery Health', riskEvaluation.weightedBreakdown.battery, 10],
                ['Responsiveness', riskEvaluation.weightedBreakdown.unresponsiveness, 15],
              ].map(([label, val, max]) => (
                <div key={label as string} className="flex items-center justify-between text-xs">
                  <span className="text-sub font-semibold">{label as string}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${((val as number) / (max as number)) * 100}%` }}
                      />
                    </div>
                    <span className="text-main font-black text-[11px] w-10 text-right">
                      {val as number} / {max as number}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
