import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { SafeTransitMap } from '../Map/SafeTransitMap';
import { soundEngine } from '../../utils/audioSynth';
import {
  ShieldAlert, ShieldCheck, Radio, Phone, Siren,
  FileText, CheckCircle2, AlertTriangle, Battery,
  MapPin, Clock, Activity, Mic, Lock, Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuardianDashboard: React.FC = () => {
  const { state, activeRoute, riskEvaluation, resolveEmergency } = useSafety();
  const [showEvidence, setShowEvidence] = useState(false);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);

  const isCrit = state.isSosTriggered || riskEvaluation.riskLevel === 'critical';
  const isCaution = riskEvaluation.riskLevel === 'caution';

  const handleResolve = () => {
    resolveEmergency();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const history = state.riskHistory;
  const points = history.map((item, idx) => {
    const x = (idx / Math.max(1, history.length - 1)) * 260;
    const y = 50 - (item.score / 100) * 40;
    return `${x},${y}`;
  }).join(' ');

  const statusColor = isCrit ? 'text-rose-300 border-rose-400/40 bg-rose-500/15' : isCaution ? 'text-amber-300 border-amber-400/40 bg-amber-500/15' : 'text-emerald-300 border-emerald-400/40 bg-emerald-500/15';

  return (
    <div className="w-full space-y-4">
      {/* Header Card */}
      <div className="glass rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/safetransit-logo.svg" alt="SafeTransit" className="w-10 h-10 rounded-2xl shadow-sm ring-1 ring-white/60" />
          <div>
            <h2 className="text-base font-bold text-white">Guardian Console</h2>
            <p className="text-[11px] text-white/50">Tracking: <span className="text-purple-300 font-bold">Ananya Sharma · ST-9428</span></p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-2xl border flex items-center gap-2 text-xs font-bold ${statusColor} ${isCrit ? 'animate-pulse' : ''}`}>
          {isCrit ? <ShieldAlert className="w-4 h-4" /> : isCaution ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {isCrit ? 'EMERGENCY ALERT' : isCaution ? 'CAUTION: Anomaly' : 'Commuter Safe'}
        </div>
      </div>

      {/* SOS Alert Banner */}
      {state.isSosTriggered && (
        <div className="glass rounded-3xl p-4 bg-rose-500/15 border border-rose-400/40 animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-500 rounded-2xl shadow-lg shadow-rose-500/30">
                <ShieldAlert className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase bg-rose-500 text-white px-2 py-0.5 rounded">Priority 1</span>
                  <span className="text-[10px] text-rose-300/80 font-mono">{state.simulatedHour}:{String(state.simulatedMinute).padStart(2,'0')} IST</span>
                </div>
                <p className="text-sm font-bold text-rose-200">{state.sosTriggerReason}</p>
                <p className="text-xs text-rose-300/70 mt-0.5">+{state.deviationDistanceMeters}m off Satara Road · Market Yard</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowEvidence(true)} className="glass-sm px-3 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-white/20 transition">
                <FileText className="w-3.5 h-3.5" /> Evidence
              </button>
              <button onClick={() => { setDispatchConfirmed(true); setTimeout(() => setDispatchConfirmed(false), 4000); }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition">
                <Siren className="w-3.5 h-3.5" /> {dispatchConfirmed ? '✅ Dispatched' : 'Call 112'}
              </button>
              <button onClick={handleResolve} className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/30 transition">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolve Safe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Column (7 cols) */}
        <div className="lg:col-span-7 glass rounded-3xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <MapPin className="w-3.5 h-3.5 text-purple-300" /> Real-Time GPS Trace
            </div>
            <span className="text-white/40 font-mono text-[10px]">
              {state.currentCoordinates[0].toFixed(4)}° N, {state.currentCoordinates[1].toFixed(4)}° E
            </span>
          </div>

          <div className="glass-sm rounded-2xl overflow-hidden">
            <SafeTransitMap heightClass="h-[340px]" isGuardianView />
          </div>

          {/* Route Pills */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { label: 'Origin', value: 'Swargate Hub' },
              { label: 'Line', value: activeRoute.transitMode },
              { label: 'Destination', value: 'VIT Pune' },
            ].map(({ label, value }) => (
              <div key={label} className="glass-sm rounded-xl py-2 px-2">
                <div className="text-[9px] text-white/40 uppercase tracking-wider font-semibold">{label}</div>
                <div className="font-bold text-white text-[11px] mt-0.5 truncate">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Sparkline */}
          <div className="glass rounded-3xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <Activity className="w-4 h-4 text-purple-300" /> Risk Trend
              </div>
              <span className="text-2xl font-black font-mono text-white">
                {riskEvaluation.totalRisk}<span className="text-sm text-white/40 font-bold"> /100</span>
              </span>
            </div>

            <div className="w-full h-16 glass-sm rounded-xl p-2 relative overflow-hidden">
              <div className="absolute top-[38%] left-0 right-0 border-t border-rose-400/30 border-dashed z-0">
                <span className="absolute right-2 -top-3.5 text-[8px] text-rose-300/70 font-mono font-bold">70 threshold</span>
              </div>
              <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 260 50" preserveAspectRatio="none">
                {history.length > 1 && (
                  <polyline fill="none"
                    stroke={isCrit ? '#f43f5e' : isCaution ? '#f59e0b' : '#a78bfa'}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    points={points}
                  />
                )}
              </svg>
            </div>

            <div className="mt-2 glass-sm rounded-xl p-2.5 text-[11px] text-white/60">
              <span className="text-white font-bold block mb-0.5">AI Insight:</span>
              {riskEvaluation.explanationDescription}
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: <Battery className="w-3.5 h-3.5" />, label: 'Battery', value: `${state.batteryLevel}%`, sub: state.batteryLevel < 20 ? '⚠️ Low' : 'Nominal', alert: state.batteryLevel < 20 },
              { icon: <Clock className="w-3.5 h-3.5" />, label: 'ETA', value: `${Math.max(2, Math.round((1 - state.progressFraction) * activeRoute.estimatedDurationMin))} min`, sub: state.isStoppedUnusually ? 'Delayed' : 'On-schedule', alert: state.isStoppedUnusually },
              { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'Deviation', value: state.isDeviated ? `+${state.deviationDistanceMeters}m` : '0m', sub: state.isDeviated ? 'Off-path' : 'Safe corridor', alert: state.isDeviated },
              { icon: <Radio className="w-3.5 h-3.5" />, label: 'Carrier', value: 'Jio 5G', sub: 'Node 412 · Pune', alert: false },
            ].map(({ icon, label, value, sub, alert }) => (
              <div key={label} className="glass rounded-2xl p-3">
                <div className="flex items-center gap-1 text-white/50 text-[10px] font-medium mb-1.5">{icon} {label}</div>
                <div className={`text-base font-black font-mono ${alert ? 'text-rose-300' : 'text-white'}`}>{value}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Guardian Action Buttons */}
          <div className="glass rounded-3xl p-4 space-y-2">
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-1">Guardian Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="glass-sm py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/20 transition">
                <Phone className="w-3.5 h-3.5 text-emerald-300" /> Call Ananya
              </button>
              <button onClick={() => soundEngine.playPanicSiren()}
                className="glass-sm py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/20 transition">
                <Volume2 className="w-3.5 h-3.5 text-amber-300" /> Sound Siren
              </button>
            </div>
            <button onClick={() => setShowEvidence(true)}
              className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition">
              <Lock className="w-3.5 h-3.5 text-purple-300" /> Open Forensic Evidence Locker
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      {showEvidence && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg glass rounded-[28px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-purple-300" />
                <div>
                  <h3 className="text-base font-bold text-white">Evidence Locker</h3>
                  <p className="text-[10px] text-white/40 font-mono">{state.evidencePackage?.id || 'EVID-PUNE-2026'}</p>
                </div>
              </div>
              <button onClick={() => setShowEvidence(false)} className="text-white/50 hover:text-white glass-sm px-2.5 py-1 rounded-lg text-xs transition">✕ Close</button>
            </div>

            <div className="space-y-3 text-xs">
              {/* GPS Block */}
              <div className="glass-sm rounded-2xl p-3 space-y-2">
                <p className="text-[10px] text-white/40 uppercase font-semibold">GPS Snapshot</p>
                {[
                  ['Coordinates', `${state.currentCoordinates[0].toFixed(6)}° N, ${state.currentCoordinates[1].toFixed(6)}° E`],
                  ['Nearest Zone', 'Market Yard Hinterland, Pune'],
                  ['Deviation', `+${state.deviationDistanceMeters}m off Satara Road`],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between">
                    <span className="text-white/50">{l as string}</span>
                    <span className="text-white font-semibold text-right ml-4">{v as string}</span>
                  </div>
                ))}
              </div>

              {/* Audio Capture */}
              <div className="glass-sm rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/60 text-[10px] font-semibold uppercase">
                    <Mic className="w-3.5 h-3.5" /> Ambient Audio Buffer
                  </div>
                  <span className="text-[9px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full border border-white/15">Encrypted · Opus</span>
                </div>
                <div className="flex items-center gap-3 glass-sm rounded-xl p-2.5">
                  <button onClick={() => { setPlayingAudio(true); setTimeout(() => setPlayingAudio(false), 5000); }}
                    className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 border border-purple-400/30 text-white transition">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-end gap-0.5 h-7">
                      {[10,25,18,40,55,32,15,48,60,22,35,50,28,42,18,55,30,14,45,20].map((h, i) => (
                        <div key={i} className={`flex-1 rounded-full ${playingAudio ? 'bg-purple-400 animate-pulse' : 'bg-white/25'}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <p className="text-[9px] text-white/30 mt-1">{playingAudio ? 'Playing ambient stream...' : 'Duration: 00:05'}</p>
                  </div>
                </div>
              </div>

              {/* Hash */}
              <div className="glass-sm rounded-2xl p-3">
                <p className="text-[10px] text-white/40 uppercase font-semibold mb-1.5">Cryptographic Integrity</p>
                <p className="font-mono text-[10px] text-white/60 break-all">
                  SHA-256: {state.evidencePackage?.digitalSignature || '0x7f8a91b4c3e210984d720b08a1c953a992ff'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => { setDispatchConfirmed(true); setShowEvidence(false); setTimeout(() => setDispatchConfirmed(false), 4000); }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-1.5 transition">
                <Siren className="w-4 h-4" /> Export to Emergency 112
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
