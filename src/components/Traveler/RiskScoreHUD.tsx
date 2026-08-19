import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, Zap, Battery, Clock, Info } from 'lucide-react';

export const RiskScoreHUD: React.FC = () => {
  const { riskEvaluation, state } = useSafety();
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  const score = riskEvaluation.totalRisk;
  const level = riskEvaluation.riskLevel;

  const getTheme = () => {
    if (level === 'critical' || state.isSosTriggered) {
      return {
        cardBorder: 'border-rose-200/80 ring-1 ring-rose-100',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        ringStroke: '#f43f5e',
        scoreColor: 'text-rose-600',
        label: 'High Risk Alert',
        subtext: 'Route deviation anomaly active',
        icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      };
    }
    if (level === 'caution') {
      return {
        cardBorder: 'border-amber-200/80 ring-1 ring-amber-100',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        ringStroke: '#f59e0b',
        scoreColor: 'text-amber-600',
        label: 'Caution Level',
        subtext: 'Minor path or time delay',
        icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      };
    }
    return {
      cardBorder: 'border-white/90',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      ringStroke: '#10b981',
      scoreColor: 'text-slate-900',
      label: 'Journey is Safe',
      subtext: 'On-corridor transit to VIT Pune',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    };
  };

  const theme = getTheme();

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`w-full rounded-3xl bg-white/80 backdrop-blur-xl border ${theme.cardBorder} p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-white/90 border border-white shadow-xs">
            {theme.icon}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Safety Score Index
            </h3>
            <p className="text-[11px] text-slate-500">{theme.subtext}</p>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-2xl border ${theme.badge} shadow-2xs`}>
          {theme.label}
        </span>
      </div>

      {/* Main Score & Metrics */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Radial Circle */}
        <div className="col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-22 h-22 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={theme.ringStroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black font-mono tracking-tight ${theme.scoreColor}`}>
                {score}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* 3 Plain White Glass Badges */}
        <div className="col-span-7 space-y-1.5 text-xs">
          <div className="bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl p-2 flex items-center justify-between shadow-2xs">
            <span className="text-slate-500 flex items-center gap-1.5 text-[11px] font-medium">
              <Zap className="w-3.5 h-3.5 text-slate-600" />
              Route Path
            </span>
            <span className={`font-semibold text-[11px] ${state.isDeviated ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
              {state.isDeviated ? `+${state.deviationDistanceMeters}m off-route` : 'Normal Corridor'}
            </span>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl p-2 flex items-center justify-between shadow-2xs">
            <span className="text-slate-500 flex items-center gap-1.5 text-[11px] font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              Movement
            </span>
            <span className="font-semibold text-slate-800 text-[11px]">
              {state.isStoppedUnusually ? `Stopped (${state.unusualStopDurationSec}s)` : 'Moving (34 km/h)'}
            </span>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl p-2 flex items-center justify-between shadow-2xs">
            <span className="text-slate-500 flex items-center gap-1.5 text-[11px] font-medium">
              <Battery className="w-3.5 h-3.5 text-slate-600" />
              Battery
            </span>
            <span className={`font-semibold text-[11px] ${state.batteryLevel < 20 ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
              {state.batteryLevel}% {state.batteryLevel < 20 ? '⚠️ Low' : 'Optimal'}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Judge Formula */}
      <div className="mt-3 pt-2.5 border-t border-slate-100">
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-900 font-medium transition"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>How AI calculates this score</span>
          </span>
          {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFormulaDetails && (
          <div className="mt-2 bg-white/90 backdrop-blur-md border border-white rounded-2xl p-3 text-[11px] space-y-2 shadow-sm animate-fadeIn">
            <div className="font-mono text-[10px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
              Risk = (0.30×RouteDev) + (0.20×Stop) + (0.15×Time) + (0.10×Crowd) + (0.10×Battery) + (0.15×Response)
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between text-slate-600">
                <span>1. Route Deviation:</span>
                <span className="font-semibold text-slate-900">{riskEvaluation.weightedBreakdown.routeDeviation} / 30 pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>2. Unusual Stop Anomaly:</span>
                <span className="font-semibold text-slate-900">{riskEvaluation.weightedBreakdown.unusualStop} / 20 pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>3. Time of Day (Night factor):</span>
                <span className="font-semibold text-slate-900">{riskEvaluation.weightedBreakdown.timeOfDay} / 15 pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>4. Isolation / Footfall:</span>
                <span className="font-semibold text-slate-900">{riskEvaluation.weightedBreakdown.crowdDensity} / 10 pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>5. Battery Health:</span>
                <span className="font-semibold text-slate-900">{riskEvaluation.weightedBreakdown.battery} / 10 pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>6. User Responsiveness:</span>
                <span className="font-semibold text-slate-900">{riskEvaluation.weightedBreakdown.unresponsiveness} / 15 pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
