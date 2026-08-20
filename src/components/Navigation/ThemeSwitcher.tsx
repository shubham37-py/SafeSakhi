import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeMode } from '../../context/ThemeContext';
import { Moon, Flame } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'warm', label: 'Warm', icon: <Flame className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  return (
    <div className="flex items-center glass-sm rounded-2xl p-1 gap-0.5 border border-white/20">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={`${t.label} Mode`}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
            theme === t.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-sub hover:text-main hover:bg-white/10'
          }`}
        >
          {t.icon}
          <span className="hidden md:inline text-[11px]">{t.label}</span>
        </button>
      ))}
    </div>
  );
};
