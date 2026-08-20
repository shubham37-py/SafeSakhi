import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Brain, ShieldAlert, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import type { RiskLevel } from '../../types';

export const AIExplanationFeed: React.FC = () => {
  const { state, riskEvaluation } = useSafety();

  const getStyle = (level: RiskLevel) => {
    if (level === 'critical') return {
      card: 'bg-rose-500/15 border-rose-400/40 text-rose-500',
      text: 'text-rose-500 font-bold',
      sub: 'text-sub',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
      delta: 'bg-rose-500/20 text-rose-600 dark:text-rose-300',
    };
    if (level === 'caution') return {
      card: 'bg-amber-500/15 border-amber-400/40 text-amber-600',
      text: 'text-amber-600 dark:text-amber-300 font-bold',
      sub: 'text-sub',
      icon: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
      delta: 'bg-amber-500/20 text-amber-600 dark:text-amber-300',
    };
    return {
      card: 'glass-sm border-white/20',
      text: 'text-main',
      sub: 'text-sub',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
      delta: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
    };
  };

  return (
    <div className="glass rounded-3xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-accent-c" />
          <span className="text-base font-black text-main">AI Safety Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <span className="text-[10px] text-muted-c font-bold border border-white/20 px-2.5 py-1 rounded-full font-mono">
          Agent 1 · Live
        </span>
      </div>

      {/* Current Insight Card */}
      <div className="glass-sm rounded-2xl p-4 mb-4 border border-white/20">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-accent-c shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-main mb-1 leading-snug">{riskEvaluation.explanationTitle}</p>
            <p className="text-xs text-sub leading-relaxed font-medium">{riskEvaluation.explanationDescription}</p>
          </div>
        </div>
      </div>

      {/* Log Stream */}
      <p className="text-[10px] text-muted-c font-bold uppercase tracking-widest mb-2">Recent Events</p>
      <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
        {state.aiExplanationFeed.length === 0 && (
          <p className="text-xs text-muted-c text-center py-4 font-semibold">No events yet. Journey in progress...</p>
        )}
        {state.aiExplanationFeed.map((log) => {
          const s = getStyle(log.riskLevel);
          return (
            <div key={log.id} className={`rounded-xl p-3 border ${s.card}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-start gap-2">
                  {s.icon}
                  <span className={`text-xs font-black leading-tight ${s.text}`}>{log.title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {log.delta !== 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${s.delta}`}>
                      {log.delta > 0 ? `+${log.delta}` : log.delta}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-c font-mono">{log.timestamp}</span>
                </div>
              </div>
              <p className={`text-[11px] leading-relaxed font-medium ${s.sub}`}>{log.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
