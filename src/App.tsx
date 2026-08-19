import React, { useState } from 'react';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import { TravelerView } from './components/Traveler/TravelerView';
import { GuardianDashboard } from './components/Guardian/GuardianDashboard';
import { ArchitectureModal } from './components/Vision/ArchitectureModal';
import { StoryNavigator } from './components/Pitch/StoryNavigator';
import {
  Shield,
  Smartphone,
  ShieldCheck,
  Columns,
  Sparkles,
  Radio,
  Volume2,
  VolumeX,
} from 'lucide-react';

type ViewMode = 'split' | 'traveler' | 'guardian';

const MainAppContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isVisionModalOpen, setIsVisionModalOpen] = useState<boolean>(false);
  const { soundEnabled, setSoundEnabled } = useSafety();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-sm">
              <Shield className="w-5 h-5 fill-current text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">SafeTransit</h1>
                <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  Hackathon Pitch MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Predictive Transit Safety for Women • Pune Swargate ➔ VIT Bibwewadi
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-2xl p-1 shadow-inner">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Side-by-Side Pitch</span>
              <span className="md:hidden">Dual</span>
            </button>

            <button
              onClick={() => setViewMode('traveler')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'traveler'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Traveler App</span>
            </button>

            <button
              onClick={() => setViewMode('guardian')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'guardian'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guardian Console</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Architecture Vision</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition border border-slate-200"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4">
        {/* Pitch Story Navigator Bar */}
        <StoryNavigator />

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column: Traveler App (5 cols) */}
            <div className="xl:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-md mb-1.5 flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-700" />
                  <span>Passenger Mobile View</span>
                </span>
                <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full">
                  Real-Time GPS Telemetry
                </span>
              </div>
              <TravelerView />
            </div>

            {/* Right Column: Guardian Dashboard (7 cols) */}
            <div className="xl:col-span-7 flex flex-col items-center">
              <div className="w-full mb-1.5 flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Guardian Command Console (Synced Live)</span>
                </span>
                <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                  <span>BroadcastChannel Active</span>
                </span>
              </div>
              <GuardianDashboard />
            </div>
          </div>
        )}

        {viewMode === 'traveler' && (
          <div className="max-w-md mx-auto py-2">
            <TravelerView />
          </div>
        )}

        {viewMode === 'guardian' && (
          <div className="max-w-5xl mx-auto py-2">
            <GuardianDashboard />
          </div>
        )}
      </main>

      {/* Vision & Heatmap Modal */}
      <ArchitectureModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 text-center text-xs text-slate-500 shadow-2xs">
        SafeTransit • Predictive AI Women's Transit Safety Platform • Hackathon MVP (Pune Swargate ➔ VIT Bibwewadi)
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SafetyProvider>
      <MainAppContent />
    </SafetyProvider>
  );
};

export default App;
