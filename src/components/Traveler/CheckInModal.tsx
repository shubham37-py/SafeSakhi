import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { ShieldCheck, AlertOctagon, BellRing } from 'lucide-react';

export const CheckInModal: React.FC = () => {
  const { state, respondToCheckIn, triggerManualSos } = useSafety();

  if (!state.isCheckInActive) return null;

  const seconds = state.checkInCountdown;
  const isUrgent = seconds <= 5;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl relative text-center">
        {/* Soft Icon Header */}
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-amber-50 border border-amber-200 shadow-sm">
          <BellRing
            className={`w-8 h-8 ${
              isUrgent ? 'text-rose-500 animate-bounce' : 'text-amber-500 animate-pulse'
            }`}
          />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Safety Check-In
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          SafeTransit AI detected a route deviation. Are you safe and comfortable?
        </p>

        {/* Circular Countdown Progress */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={isUrgent ? '#f43f5e' : '#f59e0b'}
                strokeWidth="6"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (seconds / 12) * 251.2}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black font-mono ${isUrgent ? 'text-rose-600' : 'text-amber-600'}`}>
                {seconds}s
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">
                Auto-SOS in
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">
            No response will automatically escalate silent SOS to Guardian
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => respondToCheckIn(true)}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>YES, I AM SAFE & OK</span>
          </button>

          <button
            onClick={() => triggerManualSos('User Initiated Instant Emergency from Check-In')}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 active:scale-98"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span>I Need Help / Dispatch SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
