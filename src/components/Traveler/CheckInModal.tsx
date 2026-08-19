import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { ShieldCheck, AlertOctagon, BellRing } from 'lucide-react';

export const CheckInModal: React.FC = () => {
  const { state, respondToCheckIn, triggerManualSos } = useSafety();
  if (!state.isCheckInActive) return null;

  const seconds = state.checkInCountdown;
  const isUrgent = seconds <= 5;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm glass rounded-[28px] p-6 text-center">
        {/* Icon */}
        <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isUrgent ? 'bg-rose-500/20 border border-rose-400/30' : 'bg-amber-500/15 border border-amber-400/25'}`}>
          <BellRing className={`w-7 h-7 ${isUrgent ? 'text-rose-300 animate-bounce' : 'text-amber-300 animate-pulse'}`} />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">Safety Check-In</h3>
        <p className="text-xs text-white/50 mb-5 leading-relaxed">
          SafeTransit detected a route anomaly. Are you safe and comfortable?
        </p>

        {/* Countdown Ring */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
              <circle cx="50" cy="50" r="40"
                stroke={isUrgent ? '#f43f5e' : '#f59e0b'}
                strokeWidth="6" strokeDasharray={251.2}
                strokeDashoffset={251.2 - (seconds / 12) * 251.2}
                strokeLinecap="round" fill="none"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black font-mono ${isUrgent ? 'text-rose-300' : 'text-amber-300'}`}>{seconds}s</span>
              <span className="text-[8px] text-white/30 uppercase font-semibold">Auto-SOS in</span>
            </div>
          </div>
          <p className="text-[10px] text-white/30 mt-2">No response will escalate silent SOS to your Guardian</p>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => respondToCheckIn(true)}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" /> Yes, I'm Safe & OK
          </button>
          <button
            onClick={() => triggerManualSos('User triggered emergency from Check-In modal')}
            className="w-full py-2.5 rounded-2xl glass-sm hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-rose-400/30"
          >
            <AlertOctagon className="w-3.5 h-3.5" /> I Need Help
          </button>
        </div>
      </div>
    </div>
  );
};
