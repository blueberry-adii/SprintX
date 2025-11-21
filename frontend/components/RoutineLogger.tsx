import React, { useState } from 'react';
import { RoutineLog } from '../types';
import { Save, Sun, Monitor, BookOpen, Activity } from 'lucide-react';

interface RoutineLoggerProps {
  logs: RoutineLog[];
  addLog: (log: RoutineLog) => void;
}

export const RoutineLogger: React.FC<RoutineLoggerProps> = ({ logs, addLog }) => {
  const [logData, setLogData] = useState<Partial<RoutineLog>>({
    date: new Date().toISOString().split('T')[0],
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    studyHours: 0,
    screenTimeHours: 0,
    exerciseMinutes: 0,
    moodRating: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logs.some(l => l.date === logData.date)) {
      alert("A log for this date already exists!");
      return;
    }

    const newLog = { ...logData, id: '' } as RoutineLog; // ID handled by backend
    addLog(newLog);
  };

  const moodOptions = [
    { value: 2, label: 'Terrible', emoji: '😫' },
    { value: 4, label: 'Bad', emoji: '🙁' },
    { value: 6, label: 'Okay', emoji: '😐' },
    { value: 8, label: 'Good', emoji: '🙂' },
    { value: 10, label: 'Great', emoji: '🤩' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 p-8 animate-fade-in transition-colors">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Log Daily Routine</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your habits to help the AI understand your flow.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date</label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
              value={logData.date}
              onChange={e => setLogData({ ...logData, date: e.target.value })}
            />
          </div>

          {/* Mood Selector - Visual */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">How did you feel today?</label>
            <div className="flex justify-between gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLogData({ ...logData, moodRating: option.value })}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${
                    logData.moodRating === option.value
                      ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 border-[var(--primary-500)] shadow-md scale-105'
                      : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
                >
                  <span className="text-2xl filter drop-shadow-sm" role="img" aria-label={option.label}>{option.emoji}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${logData.moodRating === option.value ? 'text-[var(--primary-700)] dark:text-[var(--primary-300)]' : 'text-slate-400'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Study (hrs)</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary-500)]" size={18} />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                  value={logData.studyHours}
                  onChange={e => setLogData({ ...logData, studyHours: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Screen (hrs)</label>
              <div className="relative">
                 <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                  value={logData.screenTimeHours}
                  onChange={e => setLogData({ ...logData, screenTimeHours: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Exercise (mins)</label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input
                  type="number"
                  min="0"
                  step="5"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                  value={logData.exerciseMinutes}
                  onChange={e => setLogData({ ...logData, exerciseMinutes: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
             <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Wake Up</label>
                <div className="relative">
                    <Sun className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                    <input 
                        type="time" 
                        required
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                        value={logData.wakeUpTime}
                        onChange={e => setLogData({...logData, wakeUpTime: e.target.value})}
                    />
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Sleep</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🌙</div>
                    <input 
                        type="time" 
                        required
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] outline-none bg-slate-50 dark:bg-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                        value={logData.sleepTime}
                        onChange={e => setLogData({...logData, sleepTime: e.target.value})}
                    />
                </div>
             </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--primary-600)] text-white font-bold py-4 rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary-600)]/30 hover:shadow-xl active:scale-[0.99]"
          >
            <Save size={20} />
            Save Daily Log
          </button>
        </form>
      </div>
    </div>
  );
};