import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Brain, AlertCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import type { RiskLevel } from '../../types';

export const AIExplanationFeed: React.FC = () => {
  const { state, riskEvaluation } = useSafety();

  const getCardStyle = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return {
          card: 'bg-rose-50/70 border-rose-200/80 text-rose-900',
          icon: <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
          badge: 'bg-rose-100 text-rose-700 font-bold',
        };
      case 'caution':
        return {
          card: 'bg-amber-50/70 border-amber-200/80 text-amber-900',
          icon: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          badge: 'bg-amber-100 text-amber-800 font-bold',
        };
      default:
        return {
          card: 'bg-white/60 border-white/80 text-slate-800 shadow-2xs',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
          badge: 'bg-emerald-50 text-emerald-800 font-semibold',
        };
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-white/90 border border-white shadow-xs text-slate-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>AI Safety Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-500">Live natural language reasoning feed</p>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-white/90 text-slate-600 border border-white/80 px-2.5 py-0.5 rounded-full font-semibold shadow-2xs">
          Agent 1 Feed
        </span>
      </div>

      {/* Primary Current AI Insight Card (Frosted White) */}
      <div className="mb-3 bg-white/70 backdrop-blur-md border border-white rounded-2xl p-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <Brain className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              {riskEvaluation.explanationTitle}
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">
              {riskEvaluation.explanationDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Historical Reason Stream */}
      <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
        {state.aiExplanationFeed.map((log) => {
          const style = getCardStyle(log.riskLevel);
          return (
            <div
              key={log.id}
              className={`rounded-2xl p-2.5 backdrop-blur-md border ${style.card} transition-all duration-200`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {style.icon}
                  <span className="text-xs font-bold">{log.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  {log.delta !== 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-lg ${
                        log.delta > 0
                          ? 'bg-rose-100 text-rose-700 font-bold'
                          : 'bg-emerald-100 text-emerald-800 font-semibold'
                      }`}
                    >
                      {log.delta > 0 ? `+${log.delta}` : log.delta} Risk
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-500 bg-white/90 px-1.5 py-0.5 rounded-lg border border-white">
                    {log.timestamp}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                {log.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
