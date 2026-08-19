import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Play, Navigation, BellRing, AlertOctagon, RotateCcw, ArrowRight } from 'lucide-react';

export const StoryNavigator: React.FC = () => {
  const {
    state,
    resetJourney,
    triggerRouteDeviation,
    triggerCheckIn,
    triggerManualSos,
  } = useSafety();

  const isDeviated = state.isDeviated;
  const isCheckIn = state.isCheckInActive;
  const isSos = state.isSosTriggered;

  // Determine current active narrative stage
  let activeStep = 1;
  if (isSos) activeStep = 4;
  else if (isCheckIn) activeStep = 3;
  else if (isDeviated) activeStep = 2;

  const handleStepClick = (step: number) => {
    if (step === 1) {
      resetJourney();
    } else if (step === 2) {
      if (!isDeviated) triggerRouteDeviation(true);
    } else if (step === 3) {
      triggerCheckIn();
    } else if (step === 4) {
      triggerManualSos('Pitch Stage Demo: Silent Auto-SOS Trigger');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-4 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span>🎯 Live Demo Storyline:</span>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any step to demonstrate the AI escalation pipeline
          </span>
        </div>

        {/* 4 Story Steps */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {/* Step 1 */}
          <button
            onClick={() => handleStepClick(1)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeStep === 1
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>1. Normal Safe</span>
          </button>

          <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />

          {/* Step 2 */}
          <button
            onClick={() => handleStepClick(2)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeStep === 2
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>2. Route Drift</span>
          </button>

          <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />

          {/* Step 3 */}
          <button
            onClick={() => handleStepClick(3)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeStep === 3
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>3. Check-In</span>
          </button>

          <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />

          {/* Step 4 */}
          <button
            onClick={() => handleStepClick(4)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeStep === 4
                ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>4. Auto-SOS</span>
          </button>

          {/* Reset button */}
          <button
            onClick={resetJourney}
            title="Reset to Baseline"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
