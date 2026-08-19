import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { EyeOff, Calculator, FileText } from 'lucide-react';

export const DiscreetMode: React.FC = () => {
  const { toggleDiscreetMode, riskEvaluation, state, triggerManualSos } = useSafety();
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [activeTab, setActiveTab] = useState<'calc' | 'notes'>('calc');
  const [noteText, setNoteText] = useState<string>('Meeting notes:\n- Review safety presentation\n- Finalize slide deck\n- Call family');

  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      if (calcDisplay === '911' || calcDisplay === '112' || calcDisplay === '000') {
        triggerManualSos('Secret Code Entered in Discreet Calculator Mode');
        setCalcDisplay('SOS SENT');
        return;
      }
      try {
        const res = Function(`'use strict'; return (${calcDisplay.replace(/×/g, '*').replace(/÷/g, '/')})`)();
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      if (calcDisplay === '0' || calcDisplay === 'SOS SENT' || calcDisplay === 'Error') {
        setCalcDisplay(val);
      } else {
        setCalcDisplay((prev) => prev + val);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-100 flex flex-col items-center justify-between p-4 text-slate-800 font-sans">
      {/* Top Camouflage Bar */}
      <div className="w-full max-w-sm flex items-center justify-between py-2 border-b border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${
              activeTab === 'calc' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500'
            }`}
          >
            <Calculator className="w-3 h-3" />
            <span>Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${
              activeTab === 'notes' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Notes</span>
          </button>
        </div>

        <button
          onClick={toggleDiscreetMode}
          className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 shadow-2xs"
        >
          <EyeOff className="w-3 h-3 text-emerald-600" />
          <span>Exit Camouflage</span>
        </button>
      </div>

      {/* Main Camouflage Screen Content */}
      <div className="w-full max-w-sm flex-1 flex flex-col justify-center py-4">
        {activeTab === 'calc' ? (
          <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-lg">
            {/* Display */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-3 text-right border border-slate-200/80">
              <div className="text-3xl font-mono font-bold tracking-tight text-slate-900 overflow-x-auto">
                {calcDisplay}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2">
              {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '00', '='].map(
                (btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcClick(btn)}
                    className={`py-3 rounded-2xl font-mono text-base font-semibold transition active:scale-95 ${
                      btn === '='
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm'
                        : ['÷', '×', '-', '+'].includes(btn)
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold'
                        : btn === 'C'
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {btn}
                  </button>
                )
              )}
            </div>
            <div className="mt-3 text-center text-[10px] text-slate-400 font-mono">
              Tip: Type 112 and press = to secretly trigger silent SOS
            </div>
          </div>
        ) : (
          <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-lg flex-1 flex flex-col">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-sm text-center text-[10px] text-slate-400 font-medium">
        SafeTransit Background Tracking Active • Risk: {riskEvaluation.totalRisk}/100 • {state.isSosTriggered ? 'SOS Sent' : 'Safe'}
      </div>
    </div>
  );
};
