import React, { useState } from 'react';
import { Brain, Cpu, Map, Users, Sparkles, Network, Layers } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'heatmap'>('agents');

  if (!isOpen) return null;

  const puneZones = [
    { name: 'Swargate Metro & Jedhe Chowk', score: 92, trust: 'High Trust', lighting: '95%', cctv: '98%', busFrequency: '2 mins' },
    { name: 'Laxmi Narayan Satara Rd Corridor', score: 86, trust: 'High Trust', lighting: '88%', cctv: '90%', busFrequency: '4 mins' },
    { name: 'City Pride & Aranyeshwar', score: 82, trust: 'Good', lighting: '84%', cctv: '82%', busFrequency: '5 mins' },
    { name: 'Padmavati Chowk BRT', score: 84, trust: 'Good', lighting: '86%', cctv: '85%', busFrequency: '4 mins' },
    { name: 'Bibwewadi Main Road & VIT Campus', score: 90, trust: 'High Trust (Student Zone)', lighting: '92%', cctv: '94%', busFrequency: '3 mins' },
    { name: 'Market Yard Hinterland (Caution Zone)', score: 38, trust: 'Low / Isolated', lighting: '22%', cctv: '18%', busFrequency: '25 mins' },
  ];

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl rounded-[36px] bg-white/90 backdrop-blur-2xl border border-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white border border-white shadow-2xs text-slate-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">SafeTransit AI Architecture & Vision</h3>
              <p className="text-xs text-slate-500">Multi-Agent Safety Orchestration & Community Heatmap Model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold px-3 py-1.5 bg-white rounded-2xl border border-white shadow-2xs"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-4 bg-white/70 backdrop-blur-md p-1 rounded-2xl border border-white shadow-2xs">
          <button
            onClick={() => setActiveTab('agents')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'agents'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Multi-Agent AI Framework</span>
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'heatmap'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Pune Transit Safety Heatmap</span>
          </button>
        </div>

        {/* Tab 1: Multi-Agent AI Framework */}
        {activeTab === 'agents' && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-md border border-white rounded-3xl p-4 shadow-2xs">
              <div className="text-xs text-slate-900 font-bold mb-1">
                Pitch Perspective: Autonomous Multi-Agent Hierarchy
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                SafeTransit is architected around a distributed, multi-agent AI system where specialized agents monitor spatial geometry, simulate digital twin alternative futures, and automate evidence preservation without requiring constant user intervention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Agent 1 (Live MVP) */}
              <div className="bg-white/90 p-4 rounded-3xl border border-white relative shadow-sm">
                <span className="absolute top-3 right-3 text-[9px] font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-full">
                  LIVE MVP (Agent 1)
                </span>
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                  <Brain className="w-4 h-4 text-emerald-600" />
                  <span>Spatio-Temporal Risk Diagnoser</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Evaluates real-time deviations, unusual stops, lighting metrics, and responsiveness. Generates human-explainable natural language logs (XAI).
                </p>
                <div className="mt-2 text-[10px] text-emerald-700 font-bold">
                  Status: 100% Operational in Demo
                </div>
              </div>

              {/* Agent 2 */}
              <div className="bg-white/80 p-4 rounded-3xl border border-white relative shadow-2xs">
                <span className="absolute top-3 right-3 text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                  ROADMAP
                </span>
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span>Digital Twin Journey Forecaster</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Continuously runs 100+ Monte Carlo path simulations 15 minutes ahead of current position to predict choke points and hazardous deviations.
                </p>
                <div className="mt-2 text-[10px] text-slate-400">
                  Status: Phase 2 Architecture
                </div>
              </div>

              {/* Agent 3 */}
              <div className="bg-white/80 p-4 rounded-3xl border border-white relative shadow-2xs">
                <span className="absolute top-3 right-3 text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                  ROADMAP
                </span>
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                  <Cpu className="w-4 h-4 text-slate-600" />
                  <span>Autonomous Evidence & 112 Dispatch</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Cryptographically signs ambient audio buffers, GPS telemetry snapshots, and formats automated packets for smart city emergency CAD systems.
                </p>
                <div className="mt-2 text-[10px] text-slate-400">
                  Status: Phase 2 Architecture
                </div>
              </div>

              {/* Agent 4 */}
              <div className="bg-white/80 p-4 rounded-3xl border border-white relative shadow-2xs">
                <span className="absolute top-3 right-3 text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                  ROADMAP
                </span>
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Collective Trust Consensus Agent</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Aggregates crowdsourced commuter reviews, street light outages, and bus reliability scores without exposing individual passenger locations.
                </p>
                <div className="mt-2 text-[10px] text-slate-400">
                  Status: Phase 3 Architecture
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Community Safety Heatmap */}
        {activeTab === 'heatmap' && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pune Urban Transit Corridor Safety Scores</h4>
                  <p className="text-xs text-slate-500">Aggregated street lighting, CCTV coverage, and transit frequency</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full font-semibold">
                  City Pulse Index
                </span>
              </div>

              <div className="space-y-2">
                {puneZones.map((zone, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white border border-white flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{zone.name}</div>
                      <div className="text-[11px] text-slate-500 flex gap-2 mt-0.5">
                        <span>💡 Light: {zone.lighting}</span>
                        <span>•</span>
                        <span>📹 CCTV: {zone.cctv}</span>
                        <span>•</span>
                        <span>🚌 Bus: {zone.busFrequency}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-sm ${
                          zone.score >= 80 ? 'text-slate-900' : 'text-rose-600'
                        }`}
                      >
                        {zone.score}/100
                      </span>
                      <div className="text-[10px] text-slate-400 font-medium">{zone.trust}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
