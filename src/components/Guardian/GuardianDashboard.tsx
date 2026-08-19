import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { SafeTransitMap } from '../Map/SafeTransitMap';
import { soundEngine } from '../../utils/audioSynth';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  Phone,
  Siren,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Battery,
  MapPin,
  Clock,
  Activity,
  Mic,
  Lock,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuardianDashboard: React.FC = () => {
  const { state, activeRoute, riskEvaluation, resolveEmergency } = useSafety();
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [isPlayingAudioSample, setIsPlayingAudioSample] = useState<boolean>(false);
  const [dispatchConfirmed, setDispatchConfirmed] = useState<boolean>(false);

  const isCritical = state.isSosTriggered || riskEvaluation.riskLevel === 'critical';
  const isCaution = riskEvaluation.riskLevel === 'caution';

  const handleTriggerSiren = () => {
    soundEngine.playPanicSiren();
  };

  const handleDispatch112 = () => {
    setDispatchConfirmed(true);
    setTimeout(() => {
      setDispatchConfirmed(false);
    }, 4000);
  };

  const handleResolve = () => {
    resolveEmergency();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const simulatePlayAudio = () => {
    setIsPlayingAudioSample(true);
    setTimeout(() => {
      setIsPlayingAudioSample(false);
    }, 5000);
  };

  // Sparkline points
  const history = state.riskHistory;
  const maxScore = 100;
  const points = history.map((item, idx) => {
    const x = (idx / Math.max(1, history.length - 1)) * 260;
    const y = 50 - (item.score / maxScore) * 40;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 text-slate-800 p-1 sm:p-2 font-sans">
      {/* Top Header Card (Plain White Frosted Glass) */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white border border-white flex items-center justify-center text-slate-800 shadow-2xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Guardian Command Center
              </h2>
              <span className="text-[10px] bg-white/90 text-emerald-800 px-2.5 py-0.5 rounded-full border border-white font-semibold shadow-2xs">
                Live Broadcast Link
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Monitoring Traveler: <span className="text-slate-900 font-bold">Ananya Sharma (ID: ST-9428)</span>
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`px-3.5 py-1.5 rounded-2xl border flex items-center gap-2 text-xs font-bold backdrop-blur-md ${
            isCritical
              ? 'bg-rose-50/90 border-rose-300 text-rose-700 shadow-sm animate-pulse'
              : isCaution
              ? 'bg-amber-50/90 border-amber-300 text-amber-800'
              : 'bg-white/90 border-white text-emerald-800 shadow-2xs'
          }`}
        >
          {isCritical ? (
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          ) : isCaution ? (
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          )}
          <span>
            {isCritical
              ? 'EMERGENCY ALERT TRIGGERED'
              : isCaution
              ? 'CAUTION: ROUTE ANOMALY'
              : 'COMMUTER SAFE & ON-TRACK'}
          </span>
        </div>
      </div>

      {/* Urgent Emergency Alert Banner */}
      {state.isSosTriggered && (
        <div className="bg-rose-50/90 backdrop-blur-xl border border-rose-300 rounded-3xl p-4 shadow-lg animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-500 text-white rounded-2xl shadow-md">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-rose-600 text-white px-2 py-0.5 rounded">
                    PRIORITY 1 AUTO-SOS
                  </span>
                  <span className="text-xs text-rose-700 font-mono">
                    Logged at {state.simulatedHour}:{String(state.simulatedMinute).padStart(2, '0')} IST
                  </span>
                </div>
                <h3 className="text-sm font-bold text-rose-950 mt-1">
                  Reason: {state.sosTriggerReason}
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Route deviation: +{state.deviationDistanceMeters}m off Satara Road near Market Yard Hinterland.
                </p>
              </div>
            </div>

            {/* Emergency Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowEvidenceModal(true)}
                className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-white text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
              >
                <FileText className="w-4 h-4 text-slate-700" />
                <span>Evidence Locker</span>
              </button>

              <button
                onClick={handleDispatch112}
                className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition active:scale-95"
              >
                <Siren className="w-4 h-4" />
                <span>{dispatchConfirmed ? '✅ Dispatched to 112' : 'Dispatch Police 112'}</span>
              </button>

              <button
                onClick={handleResolve}
                className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolve Safe</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Map & Right Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Map (7 cols) */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-slate-700" />
              <span>Real-Time GPS Location Trace</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {state.currentCoordinates[0].toFixed(4)}° N, {state.currentCoordinates[1].toFixed(4)}° E
            </div>
          </div>

          <SafeTransitMap heightClass="h-[360px]" isGuardianView={true} />

          {/* Route Summary Pills */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/70 backdrop-blur-md p-2.5 rounded-2xl border border-white shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">Origin</span>
              <span className="font-bold text-slate-800 text-[11px] truncate block">
                Swargate Terminal
              </span>
            </div>
            <div className="bg-white/70 backdrop-blur-md p-2.5 rounded-2xl border border-white shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">Transit Line</span>
              <span className="font-bold text-slate-800 text-[11px] truncate block">
                {activeRoute.transitMode}
              </span>
            </div>
            <div className="bg-white/70 backdrop-blur-md p-2.5 rounded-2xl border border-white shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">Destination</span>
              <span className="font-bold text-slate-800 text-[11px] truncate block">
                VIT Pune Campus
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry & Sparkline (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Risk Sparkline Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-bold text-slate-900">Risk Score Trend</h4>
              </div>
              <div className="text-right">
                <span className="text-xl font-black font-mono text-slate-900">
                  {riskEvaluation.totalRisk}
                </span>
                <span className="text-xs text-slate-400 font-bold"> / 100</span>
              </div>
            </div>

            {/* Sparkline Graph */}
            <div className="w-full h-16 bg-white/60 backdrop-blur-md rounded-2xl p-2 border border-white relative overflow-hidden flex flex-col justify-end">
              <div className="absolute top-[35%] left-0 right-0 border-b border-rose-200 border-dashed z-0">
                <span className="absolute right-2 -top-2.5 text-[8px] font-bold text-rose-500 font-mono">
                  Critical Boundary (70+)
                </span>
              </div>

              <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 260 50" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke={isCritical ? '#f43f5e' : isCaution ? '#f59e0b' : '#059669'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>

            <div className="mt-2.5 bg-white/70 backdrop-blur-md p-2.5 rounded-2xl border border-white text-[11px] text-slate-600">
              <span className="font-bold text-slate-800 block mb-0.5">AI Diagnostic Insight:</span>
              <p className="leading-tight">{riskEvaluation.explanationDescription}</p>
            </div>
          </div>

          {/* Telemetry Snapshot Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium mb-1">
                <Battery className="w-3.5 h-3.5 text-slate-600" />
                <span>Phone Battery</span>
              </div>
              <div className="text-base font-bold text-slate-900 font-mono">
                {state.batteryLevel}%
              </div>
              <div className="text-[10px] text-slate-400">
                {state.batteryLevel < 20 ? '⚠️ Low Battery' : 'Nominal Level'}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                <span>Estimated ETA</span>
              </div>
              <div className="text-base font-bold text-slate-900 font-mono">
                {Math.max(2, Math.round((1 - state.progressFraction) * activeRoute.estimatedDurationMin))} min
              </div>
              <div className="text-[10px] text-slate-400">
                {state.isStoppedUnusually ? 'Stationary Delay' : 'On-Schedule'}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-slate-600" />
                <span>Route Deviation</span>
              </div>
              <div className={`text-base font-bold font-mono ${state.isDeviated ? 'text-rose-600' : 'text-slate-900'}`}>
                {state.isDeviated ? `+${state.deviationDistanceMeters}m` : '0m'}
              </div>
              <div className="text-[10px] text-slate-400">
                {state.isDeviated ? 'Off Expected Path' : 'Safe Corridor'}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium mb-1">
                <Radio className="w-3.5 h-3.5 text-slate-600" />
                <span>Cell Carrier</span>
              </div>
              <div className="text-xs font-bold text-slate-900 truncate">
                Jio 5G South
              </div>
              <div className="text-[10px] text-slate-400">Node #412 Pune</div>
            </div>
          </div>

          {/* Guardian Action Deck */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Guardian Actions
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:911"
                className="py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white shadow-2xs transition"
              >
                <Phone className="w-3.5 h-3.5 text-slate-700" />
                <span>Call Ananya</span>
              </a>

              <button
                onClick={handleTriggerSiren}
                className="py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white shadow-2xs transition"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-700" />
                <span>Sound Siren</span>
              </button>
            </div>

            <button
              onClick={() => setShowEvidenceModal(true)}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Open Forensic Evidence Locker</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Evidence Locker Modal (Plain White Frosted Glass) */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-[32px] bg-white/90 backdrop-blur-2xl border border-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-white border border-white shadow-2xs text-slate-800">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Incident Evidence Locker</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Chain of Custody: {state.evidencePackage?.id || 'EVID-PUNE-2026'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1.5 bg-white rounded-xl border border-white shadow-2xs"
              >
                ✕
              </button>
            </div>

            {/* Evidence Cards */}
            <div className="space-y-3 text-xs">
              <div className="bg-white/80 p-3 rounded-2xl border border-white shadow-2xs space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">GPS & Geo-Location Snapshot</div>
                <div className="flex justify-between text-slate-700">
                  <span>Coordinates:</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {state.currentCoordinates[0].toFixed(6)}° N, {state.currentCoordinates[1].toFixed(6)}° E
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Nearest Sector:</span>
                  <span className="font-semibold text-slate-800">
                    Market Yard Hinterland / Satara Rd Bypass, Pune
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Corridor Deviation:</span>
                  <span className="font-mono text-rose-600 font-bold">
                    +{state.deviationDistanceMeters} meters off route
                  </span>
                </div>
              </div>

              {/* Synthetic Audio Recording Capture */}
              <div className="bg-white/80 p-3 rounded-2xl border border-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Silent Ambient Audio Buffer (5s Auto-Recorded)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">Encrypted</span>
                </div>

                <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-white shadow-2xs">
                  <button
                    onClick={simulatePlayAudio}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-1 h-6">
                      {[12, 24, 8, 30, 42, 18, 55, 34, 12, 45, 60, 20, 15, 38, 50, 22, 14, 28, 48, 12].map(
                        (h, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-full transition-all duration-200 ${
                              isPlayingAudioSample
                                ? 'bg-emerald-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                      <span>{isPlayingAudioSample ? 'Playing ambient stream...' : 'Duration: 00:05'}</span>
                      <span>Format: Opus 24kbps (End-to-End Encrypted)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Hash */}
              <div className="bg-white/80 p-3 rounded-2xl border border-white font-mono text-[10px] text-slate-500 space-y-1 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-700 uppercase">Cryptographic Integrity Stamp</div>
                <div className="text-slate-800 break-all">
                  SHA-256: {state.evidencePackage?.digitalSignature || '0x7f8a91b4c3e210984d720b08a1c953a992ff'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={handleDispatch112}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5"
              >
                <Siren className="w-4 h-4" />
                <span>Export Telemetry to Emergency 112</span>
              </button>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-white text-slate-700 font-semibold text-xs shadow-2xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
