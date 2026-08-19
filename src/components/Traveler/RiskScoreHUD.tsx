import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, Zap, Battery, Clock, Info } from 'lucide-react';

export const RiskScoreHUD: React.FC = () => {
  const { riskEvaluation, state } = useSafety();
  const [showFormula, setShowFormula] = useState(false);

  const score = riskEvaluation.totalRisk;
  const level = riskEvaluation.riskLevel;

  const theme = level === 'critical' || state.isSosTriggered
    ? { ring: '#f43f5e', badge: 'bg-rose-500/20 text-rose-200 border-rose-400/30', score: 'text-rose-300', icon: <ShieldAlert className="w-4 h-4 text-rose-300" />, label: 'High Risk' }
    : level === 'caution'
    ? { ring: '#f59e0b', badge: 'bg-amber-500/20 text-amber-200 border-amber-400/30', score: 'text-amber-300', icon: <ShieldAlert className="w-4 h-4 text-amber-300" />, label: 'Caution' }
    : { ring: '#10b981', badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30', score: 'text-white', icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />, label: 'Safe' };

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="glass rounded-3xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {theme.icon}
          <span className="text-sm font-bold text-white">Safety Score</span>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${theme.badge}`}>
          {theme.label}
        </span>
      </div>

      {/* Score Ring + Metrics */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Ring */}
        <div className="col-span-5 flex justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <circle
                cx="48" cy="48" r={radius}
                stroke={theme.ring} strokeWidth="8"
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round" fill="none"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black font-mono ${theme.score}`}>{score}</span>
              <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider">/ 100</span>
            </div>
          </div>
        </div>

        {/* Metric Pills */}
        <div className="col-span-7 space-y-2">
          {[
            { icon: <Zap className="w-3 h-3" />, label: 'Route', value: state.isDeviated ? `+${state.deviationDistanceMeters}m off` : 'Normal', alert: state.isDeviated },
            { icon: <Clock className="w-3 h-3" />, label: 'Motion', value: state.isStoppedUnusually ? `Stopped ${state.unusualStopDurationSec}s` : 'Moving', alert: state.isStoppedUnusually },
            { icon: <Battery className="w-3 h-3" />, label: 'Battery', value: `${state.batteryLevel}%`, alert: state.batteryLevel < 20 },
          ].map(({ icon, label, value, alert }) => (
            <div key={label} className="glass-sm rounded-xl px-3 py-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-white/60 text-[11px]">
                {icon}{label}
              </span>
              <span className={`text-[11px] font-bold ${alert ? 'text-rose-300' : 'text-white'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Formula */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="w-full flex items-center justify-between text-[11px] text-white/50 hover:text-white/80 transition"
        >
          <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> How AI calculates this</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFormula && (
          <div className="mt-3 glass-sm rounded-2xl p-3 space-y-2 animate-fadeIn">
            <p className="text-[10px] font-mono text-white/60 bg-white/5 p-2 rounded-lg leading-relaxed">
              Risk = (0.30×Dev) + (0.20×Stop) + (0.15×Time) + (0.10×Crowd) + (0.10×Batt) + (0.15×Response)
            </p>
            {[
              ['Route Deviation', riskEvaluation.weightedBreakdown.routeDeviation, 30],
              ['Unusual Stop', riskEvaluation.weightedBreakdown.unusualStop, 20],
              ['Time of Day', riskEvaluation.weightedBreakdown.timeOfDay, 15],
              ['Crowd / Isolation', riskEvaluation.weightedBreakdown.crowdDensity, 10],
              ['Battery Health', riskEvaluation.weightedBreakdown.battery, 10],
              ['Responsiveness', riskEvaluation.weightedBreakdown.unresponsiveness, 15],
            ].map(([label, val, max]) => (
              <div key={label as string} className="flex justify-between text-[10px] text-white/60">
                <span>{label as string}</span>
                <span className="text-white font-bold">{val as number} / {max as number}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
