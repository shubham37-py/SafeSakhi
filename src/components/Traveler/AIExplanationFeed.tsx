import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Brain, ShieldAlert, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import type { RiskLevel } from '../../types';

export const AIExplanationFeed: React.FC = () => {
  const { state, riskEvaluation } = useSafety();

  const getStyle = (level: RiskLevel) => {
    if (level === 'critical') return { card: 'bg-rose-500/15 border-rose-400/30 text-rose-200', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-300 shrink-0 mt-0.5" />, delta: 'bg-rose-500/20 text-rose-200' };
    if (level === 'caution') return { card: 'bg-amber-500/15 border-amber-400/30 text-amber-200', icon: <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />, delta: 'bg-amber-500/20 text-amber-200' };
    return { card: 'bg-white/8 border-white/15 text-white/80', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />, delta: 'bg-emerald-500/20 text-emerald-200' };
  };

  return (
    <div className="glass rounded-3xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="text-sm font-bold text-white">AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <span className="text-[10px] text-white/40 font-mono border border-white/15 px-2 py-0.5 rounded-full">Agent 1 · Live</span>
      </div>

      {/* Current Insight */}
      <div className="glass-sm rounded-2xl p-3 mb-3">
        <div className="flex items-start gap-2">
          <Brain className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-white mb-0.5">{riskEvaluation.explanationTitle}</p>
            <p className="text-[11px] text-white/60 leading-relaxed">{riskEvaluation.explanationDescription}</p>
          </div>
        </div>
      </div>

      {/* Log Stream */}
      <div className="space-y-2 max-h-44 overflow-y-auto">
        {state.aiExplanationFeed.map((log) => {
          const s = getStyle(log.riskLevel);
          return (
            <div key={log.id} className={`rounded-xl p-2.5 border ${s.card} text-xs`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-1.5">
                  {s.icon}
                  <span className="font-bold leading-tight">{log.title}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {log.delta !== 0 && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${s.delta}`}>
                      {log.delta > 0 ? `+${log.delta}` : log.delta}
                    </span>
                  )}
                  <span className="text-[9px] text-white/30 font-mono">{log.timestamp}</span>
                </div>
              </div>
              <p className="text-[10px] text-white/50 mt-1 leading-snug">{log.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
