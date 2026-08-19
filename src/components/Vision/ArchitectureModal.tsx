import React, { useState } from 'react';
import { Brain, Cpu, Map, Users, Sparkles, Network, Layers, X } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'agents' | 'heatmap'>('agents');
  if (!isOpen) return null;

  const agents = [
    { icon: <Brain className="w-5 h-5 text-emerald-300" />, title: 'Spatio-Temporal Risk Diagnoser', badge: 'LIVE MVP', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30', desc: 'Evaluates route deviations, unusual stops, time-of-night, and responsiveness. Generates plain-language XAI explanations in real time.' },
    { icon: <Layers className="w-5 h-5 text-purple-300" />, title: 'Digital Twin Journey Forecaster', badge: 'Roadmap', badgeColor: 'bg-white/10 text-white/50 border-white/20', desc: 'Monte Carlo simulations 15 min ahead of current position predicting hazardous trajectory deviations before they occur.' },
    { icon: <Cpu className="w-5 h-5 text-blue-300" />, title: 'Autonomous Evidence & 112 Dispatch', badge: 'Roadmap', badgeColor: 'bg-white/10 text-white/50 border-white/20', desc: 'Cryptographically seals GPS snapshots, ambient audio, and formats telemetry bundles for smart city emergency CAD systems.' },
    { icon: <Users className="w-5 h-5 text-amber-300" />, title: 'Collective Trust Consensus Agent', badge: 'Phase 3', badgeColor: 'bg-white/10 text-white/50 border-white/20', desc: 'Privacy-preserving crowd-sourced transit safety scores combining lighting outages, bus reliability, and community incident reports.' },
  ];

  const zones = [
    { name: 'Swargate Metro Hub', score: 92, light: '95%', cctv: '98%', bus: '2 min' },
    { name: 'Laxmi Narayan · Satara Rd', score: 86, light: '88%', cctv: '90%', bus: '4 min' },
    { name: 'City Pride BRT Stop', score: 82, light: '84%', cctv: '82%', bus: '5 min' },
    { name: 'Padmavati Chowk BRT', score: 84, light: '86%', cctv: '85%', bus: '4 min' },
    { name: 'Bibwewadi · VIT Campus', score: 90, light: '92%', cctv: '94%', bus: '3 min' },
    { name: 'Market Yard Hinterland ⚠️', score: 38, light: '22%', cctv: '18%', bus: '25 min' },
  ];

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass rounded-[28px] p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-300" />
            <div>
              <h3 className="text-base font-bold text-white">SafeTransit AI Architecture</h3>
              <p className="text-[11px] text-white/40">Multi-Agent Orchestration & Safety Heatmap</p>
            </div>
          </div>
          <button onClick={onClose} className="glass-sm p-2 rounded-xl text-white/50 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 glass-sm rounded-2xl p-1 mb-4">
          {[
            { id: 'agents', label: 'AI Agents', icon: <Network className="w-3.5 h-3.5" /> },
            { id: 'heatmap', label: 'Pune Heatmap', icon: <Map className="w-3.5 h-3.5" /> },
          ].map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id as typeof tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === id ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white/80'
              }`}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Agents Tab */}
        {tab === 'agents' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agents.map((a) => (
              <div key={a.title} className="glass-sm rounded-2xl p-4 relative">
                <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full border ${a.badgeColor}`}>{a.badge}</span>
                <div className="flex items-center gap-2 mb-2">{a.icon}<span className="text-sm font-bold text-white pr-12">{a.title}</span></div>
                <p className="text-[11px] text-white/55 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Heatmap Tab */}
        {tab === 'heatmap' && (
          <div className="space-y-2.5">
            <p className="text-[11px] text-white/50 mb-3">Aggregated safety score per corridor: lighting + CCTV + transit frequency</p>
            {zones.map((z) => (
              <div key={z.name} className="glass-sm rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{z.name}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">💡 {z.light} · 📹 {z.cctv} · 🚌 {z.bus}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className={`text-lg font-black font-mono ${z.score >= 80 ? 'text-emerald-300' : z.score >= 60 ? 'text-amber-300' : 'text-rose-400'}`}>{z.score}</p>
                  <p className="text-[9px] text-white/30">/100</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
