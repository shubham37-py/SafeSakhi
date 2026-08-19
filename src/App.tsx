import React, { useState } from 'react';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import { TravelerView } from './components/Traveler/TravelerView';
import { GuardianDashboard } from './components/Guardian/GuardianDashboard';
import { ArchitectureModal } from './components/Vision/ArchitectureModal';
import { Shield, Smartphone, ShieldCheck, LayoutTemplate, Sparkles, Volume2, VolumeX } from 'lucide-react';

type ViewMode = 'split' | 'traveler' | 'guardian';

const MainAppContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const { soundEnabled, setSoundEnabled } = useSafety();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ── */}
      <header className="glass-dark sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">SafeTransit</h1>
              <p className="text-[10px] text-white/60 hidden sm:block">Women's Predictive Safety · Pune</p>
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-2xl p-1">
            {([
              { id: 'split', label: 'Split View', icon: <LayoutTemplate className="w-3.5 h-3.5" /> },
              { id: 'traveler', label: 'Traveler', icon: <Smartphone className="w-3.5 h-3.5" /> },
              { id: 'guardian', label: 'Guardian', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            ] as const).map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="glass-sm flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white hover:bg-white/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span className="hidden sm:inline">AI Vision</span>
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="glass-sm p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            <div className="xl:col-span-5">
              <SectionLabel icon={<Smartphone className="w-3.5 h-3.5" />} text="Passenger App" />
              <TravelerView />
            </div>
            <div className="xl:col-span-7">
              <SectionLabel icon={<ShieldCheck className="w-3.5 h-3.5" />} text="Guardian Console · Live Sync" />
              <GuardianDashboard />
            </div>
          </div>
        )}
        {viewMode === 'traveler' && (
          <div className="max-w-md mx-auto">
            <TravelerView />
          </div>
        )}
        {viewMode === 'guardian' && <GuardianDashboard />}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center text-[11px] text-white/40 py-4">
        SafeTransit MVP · Pune Swargate → VIT Bibwewadi
      </footer>

      <ArchitectureModal isOpen={isVisionModalOpen} onClose={() => setIsVisionModalOpen(false)} />
    </div>
  );
};

const SectionLabel: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 mb-2 px-1 text-white/60 text-[11px] font-semibold uppercase tracking-wider">
    {icon}{text}
  </div>
);

export const App: React.FC = () => (
  <SafetyProvider>
    <MainAppContent />
  </SafetyProvider>
);

export default App;
