import React from 'react';
import { Moon, Sun, Monitor, Palette, Check } from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ darkMode, toggleDarkMode, currentTheme, setTheme }) => {
  const themes = [
    { id: 'teal', name: 'Ocean', color: '#0d9488' },
    { id: 'violet', name: 'Royal', color: '#7c3aed' },
    { id: 'blue', name: 'Sky', color: '#2563eb' },
    { id: 'orange', name: 'Sunset', color: '#ea580c' },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">App Settings</h2>
          <p className="text-slate-500 dark:text-slate-400">Customize your workspace appearance.</p>
        </div>

        <div className="p-8 space-y-10">
          {/* Appearance Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Monitor size={16} /> Appearance
            </h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Dark Mode</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {darkMode ? 'Easy on the eyes' : 'Bright and clear'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2 ${
                  darkMode ? 'bg-[var(--primary-600)]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Theme Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Palette size={16} /> Color Theme
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`relative group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    currentTheme === theme.id
                      ? 'bg-slate-50 dark:bg-slate-700 border-[var(--primary-500)] ring-1 ring-[var(--primary-500)]'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: theme.color }}
                  >
                    {currentTheme === theme.id && <Check className="text-white" size={20} strokeWidth={3} />}
                  </div>
                  <span className={`font-medium ${currentTheme === theme.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};