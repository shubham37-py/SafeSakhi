import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { SafeTransitMap } from '../Map/SafeTransitMap';
import {
  ShieldAlert, ShieldCheck, Radio, Phone, Siren,
  FileText, CheckCircle2, AlertTriangle, Battery,
  MapPin, Clock, Activity, Mic, Lock, Volume2, VolumeX,
  Download, Copy, BellRing, Wifi, Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuardianDashboard: React.FC = () => {
  const {
    state,
    activeRoute,
    riskEvaluation,
    resolveEmergency,
    triggerCheckIn,
    startSiren,
    silenceSiren,
  } = useSafety();

  const [showEvidence, setShowEvidence] = useState(false);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);
  const [pingSent, setPingSent] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);

  const isCrit = state.isSosTriggered || riskEvaluation.riskLevel === 'critical';
  const isCaution = riskEvaluation.riskLevel === 'caution';

  const handleResolve = () => {
    resolveEmergency();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleSendPing = () => {
    triggerCheckIn();
    setPingSent(true);
    setTimeout(() => setPingSent(false), 3000);
  };

  const handleToggleSiren = () => {
    if (state.isSirenActive) {
      silenceSiren();
    } else {
      startSiren();
    }
  };

  const handleCopyJSON = () => {
    const data = {
      incidentId: state.evidencePackage?.id || `ST-PUNE-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traveler: { name: 'Ananya Sharma', id: 'ST-9428', battery: `${state.batteryLevel}%` },
      route: { name: activeRoute.title, mode: activeRoute.transitMode },
      coordinates: { lat: state.currentCoordinates[0], lng: state.currentCoordinates[1] },
      deviationDistanceMeters: state.deviationDistanceMeters,
      riskScore: riskEvaluation.totalRisk,
      riskLevel: riskEvaluation.riskLevel,
      aiDiagnosticReason: riskEvaluation.explanationDescription,
      sha256Signature: state.evidencePackage?.digitalSignature || '0x7f8a91b4c3e210984d720b08a1c953a992ff',
    };
    navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2500);
  };

  const handleDownloadDossier = () => {
    const data = {
      incidentId: state.evidencePackage?.id || `ST-PUNE-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traveler: { name: 'Ananya Sharma', id: 'ST-9428', battery: `${state.batteryLevel}%` },
      coordinates: { lat: state.currentCoordinates[0], lng: state.currentCoordinates[1] },
      deviationDistanceMeters: state.deviationDistanceMeters,
      riskScore: riskEvaluation.totalRisk,
      riskLevel: riskEvaluation.riskLevel,
      aiDiagnosticReason: riskEvaluation.explanationDescription,
      sha256Signature: state.evidencePackage?.digitalSignature || '0x7f8a91b4c3e210984d720b08a1c953a992ff',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SafeTransit-Forensic-Dossier-${data.incidentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const history = state.riskHistory;
  const points = history.map((item, idx) => {
    const x = (idx / Math.max(1, history.length - 1)) * 260;
    const y = 50 - (item.score / 100) * 40;
    return `${x},${y}`;
  }).join(' ');

  const statusColor = isCrit
    ? 'text-rose-500 border-rose-400/40 bg-rose-500/15'
    : isCaution
    ? 'text-amber-500 border-amber-400/40 bg-amber-500/15'
    : 'text-emerald-500 border-emerald-400/40 bg-emerald-500/15';

  return (
    <div className="w-full space-y-4">
      {/* Header Card */}
      <div className="glass rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <img src="/safetransit-logo.svg" alt="SafeTransit" className="w-10 h-10 rounded-2xl shadow-sm ring-1 ring-white/60" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-main">Guardian Console</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 animate-pulse" /> Live Telemetry
              </span>
            </div>
            <p className="text-[11px] text-sub">Tracking: <span className="text-accent-c font-bold">Ananya Sharma · ID: ST-9428</span></p>
          </div>
        </div>
        <div className={`px-3.5 py-1.5 rounded-2xl border flex items-center gap-2 text-xs font-bold ${statusColor} ${isCrit ? 'animate-pulse' : ''}`}>
          {isCrit ? <ShieldAlert className="w-4 h-4" /> : isCaution ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {isCrit ? 'EMERGENCY ALERT' : isCaution ? 'CAUTION: Anomaly' : 'Commuter Safe'}
        </div>
      </div>

      {/* SOS Alert Banner */}
      {state.isSosTriggered && (
        <div className="glass rounded-3xl p-4 bg-rose-500/20 border border-rose-400/40 animate-pulse shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-500 rounded-2xl shadow-lg shadow-rose-500/30 text-white">
                <ShieldAlert className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase bg-rose-500 text-white px-2 py-0.5 rounded">Priority 1 Auto-SOS</span>
                  <span className="text-[10px] text-rose-500 dark:text-rose-300 font-mono">{state.simulatedHour}:{String(state.simulatedMinute).padStart(2,'0')} IST</span>
                </div>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-200">{state.sosTriggerReason}</p>
                <p className="text-xs text-rose-500/80 dark:text-rose-300/70 mt-0.5">+{state.deviationDistanceMeters}m off Satara Road corridor · Market Yard Hinterland</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowEvidence(true)}
                className="glass-sm px-3.5 py-2 rounded-xl text-main text-xs font-semibold flex items-center gap-1.5 hover:bg-white/20 transition active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" /> Forensic Evidence
              </button>
              <button
                onClick={() => { setDispatchConfirmed(true); setTimeout(() => setDispatchConfirmed(false), 4000); }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition active:scale-95"
              >
                <Siren className="w-3.5 h-3.5" /> {dispatchConfirmed ? '✅ Dispatched to 112' : 'Dispatch 112'}
              </button>
              <button
                onClick={handleResolve}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/30 transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolve Safe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Column (7 cols) */}
        <div className="lg:col-span-7 glass rounded-3xl p-3.5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-main font-bold">
              <MapPin className="w-3.5 h-3.5 text-accent-c" /> Real-Time GPS Tracking Trace
            </div>
            <span className="text-muted-c font-mono text-[10px]">
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
              { label: 'Destination', value: 'VIT Pune Bibwewadi' },
            ].map(({ label, value }) => (
              <div key={label} className="glass-sm rounded-xl py-2 px-2">
                <div className="text-[9px] text-muted-c uppercase tracking-wider font-semibold">{label}</div>
                <div className="font-bold text-main text-[11px] mt-0.5 truncate">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Sparkline */}
          <div className="glass rounded-3xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-main font-bold text-sm">
                <Activity className="w-4 h-4 text-accent-c" /> Risk Trend (0–100)
              </div>
              <span className="text-2xl font-black font-mono text-main">
                {riskEvaluation.totalRisk}<span className="text-sm text-muted-c font-bold"> /100</span>
              </span>
            </div>

            <div className="w-full h-16 glass-sm rounded-xl p-2 relative overflow-hidden">
              <div className="absolute top-[38%] left-0 right-0 border-t border-rose-400/40 border-dashed z-0">
                <span className="absolute right-2 -top-3.5 text-[8px] text-rose-500 font-mono font-bold">70 Alert Threshold</span>
              </div>
              <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 260 50" preserveAspectRatio="none">
                {history.length > 1 && (
                  <polyline
                    fill="none"
                    stroke={isCrit ? '#f43f5e' : isCaution ? '#f59e0b' : '#10b981'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                )}
              </svg>
            </div>

            <div className="mt-2.5 glass-sm rounded-xl p-2.5 text-[11px] text-sub">
              <span className="text-main font-bold block mb-0.5">AI Diagnostic Stream:</span>
              {riskEvaluation.explanationDescription}
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: <Battery className="w-3.5 h-3.5 text-emerald-500" />, label: 'Battery', value: `${state.batteryLevel}%`, sub: state.batteryLevel < 20 ? '⚠️ Low Battery' : 'Nominal', alert: state.batteryLevel < 20 },
              { icon: <Clock className="w-3.5 h-3.5 text-sky-500" />, label: 'ETA', value: `${Math.max(2, Math.round((1 - state.progressFraction) * activeRoute.estimatedDurationMin))} min`, sub: state.isStoppedUnusually ? 'Stationary Delay' : 'On-schedule', alert: state.isStoppedUnusually },
              { icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />, label: 'Deviation', value: state.isDeviated ? `+${state.deviationDistanceMeters}m` : '0m', sub: state.isDeviated ? 'Off-corridor' : 'Safe corridor', alert: state.isDeviated },
              { icon: <Radio className="w-3.5 h-3.5 text-purple-500" />, label: 'Carrier', value: 'Jio 5G South', sub: 'Node 412 · Pune', alert: false },
            ].map(({ icon, label, value, sub, alert }) => (
              <div key={label} className="glass rounded-2xl p-3 shadow-md">
                <div className="flex items-center gap-1 text-muted-c text-[10px] font-semibold mb-1">{icon} {label}</div>
                <div className={`text-base font-black font-mono ${alert ? 'text-rose-500' : 'text-main'}`}>{value}</div>
                <div className="text-[10px] text-sub mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Guardian Actions Card */}
          <div className="glass rounded-3xl p-4 space-y-2 shadow-lg">
            <p className="text-[10px] text-muted-c uppercase tracking-wider font-bold mb-1">Guardian Emergency Actions</p>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="tel:911"
                className="glass-sm py-2.5 rounded-xl text-main text-xs font-bold flex items-center justify-center gap-1 hover:bg-white/20 transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> Call
              </a>

              <button
                onClick={handleSendPing}
                className="glass-sm py-2.5 rounded-xl text-main text-xs font-bold flex items-center justify-center gap-1 hover:bg-white/20 transition active:scale-95"
                title="Send Check-In Ping to Ananya's phone"
              >
                <BellRing className={`w-3.5 h-3.5 ${pingSent ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span>{pingSent ? 'Ping Sent!' : 'Safety Ping'}</span>
              </button>

              <button
                onClick={handleToggleSiren}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition active:scale-95 ${
                  state.isSirenActive
                    ? 'bg-rose-600 text-white shadow-md animate-pulse'
                    : 'glass-sm text-main hover:bg-white/20'
                }`}
                title={state.isSirenActive ? 'Silence Alarm' : 'Sound continuous emergency siren'}
              >
                {state.isSirenActive ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> Stop Siren
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-rose-500" /> Siren
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setShowEvidence(true)}
              className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-main text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-accent-c" /> Open Forensic Evidence Locker
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Evidence Locker Modal */}
      {showEvidence && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg glass rounded-[28px] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-accent-c" />
                <div>
                  <h3 className="text-base font-bold text-main">Incident Forensic Evidence Locker</h3>
                  <p className="text-[10px] text-muted-c font-mono">Chain of Custody: {state.evidencePackage?.id || 'EVID-PUNE-2026'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEvidence(false)}
                className="text-sub hover:text-main glass-sm px-2.5 py-1 rounded-lg text-xs transition"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* GPS Block */}
              <div className="glass-sm rounded-2xl p-3.5 space-y-2">
                <p className="text-[10px] text-muted-c uppercase font-bold">GPS Telemetry Snapshot</p>
                {[
                  ['Coordinates', `${state.currentCoordinates[0].toFixed(6)}° N, ${state.currentCoordinates[1].toFixed(6)}° E`],
                  ['Nearest Zone', 'Market Yard Hinterland / Satara Rd Bypass, Pune'],
                  ['Corridor Deviation', `+${state.deviationDistanceMeters}m off Satara Road BRT`],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between">
                    <span className="text-sub font-medium">{l as string}</span>
                    <span className="text-main font-bold text-right ml-4">{v as string}</span>
                  </div>
                ))}
              </div>

              {/* Synthetic Audio Capture */}
              <div className="glass-sm rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-main text-[10px] font-bold uppercase">
                    <Mic className="w-3.5 h-3.5 text-rose-500" /> Ambient Audio Buffer (5s Auto-Recorded)
                  </div>
                  <span className="text-[9px] bg-white/15 text-main px-2 py-0.5 rounded-full border border-white/20 font-semibold">
                    Encrypted · Opus 24kbps
                  </span>
                </div>
                <div className="flex items-center gap-3 glass-sm rounded-xl p-2.5">
                  <button
                    onClick={() => { setPlayingAudio(true); setTimeout(() => setPlayingAudio(false), 5000); }}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition active:scale-95 shadow-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-end gap-0.5 h-7">
                      {[10, 25, 18, 40, 55, 32, 15, 48, 60, 22, 35, 50, 28, 42, 18, 55, 30, 14, 45, 20].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full ${playingAudio ? 'bg-purple-400 animate-pulse' : 'bg-white/30'}`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-[9px] text-muted-c mt-1">
                      {playingAudio ? 'Playing ambient stream buffer...' : 'Duration: 00:05 (Auto-captured on SOS)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash */}
              <div className="glass-sm rounded-2xl p-3.5">
                <p className="text-[10px] text-muted-c uppercase font-bold mb-1">Cryptographic Integrity Stamp</p>
                <p className="font-mono text-[10px] text-sub break-all bg-black/10 dark:bg-white/5 p-2 rounded-lg border border-white/10">
                  SHA-256: {state.evidencePackage?.digitalSignature || '0x7f8a91b4c3e210984d720b08a1c953a992ff'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadDossier}
                  className="flex-1 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-main font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" /> Download Dossier (.json)
                </button>

                <button
                  onClick={handleCopyJSON}
                  className="px-3.5 py-2.5 rounded-xl glass-sm text-main font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  {copiedJSON ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJSON ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <button
                onClick={() => { setDispatchConfirmed(true); setShowEvidence(false); setTimeout(() => setDispatchConfirmed(false), 4000); }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Siren className="w-4 h-4" /> Export Telemetry & Evidence to Police 112
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
