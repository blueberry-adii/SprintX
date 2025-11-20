import React, { useState } from 'react';
import { RoutineLog } from '../types';
import { Save, Moon, Sun, Monitor, BookOpen, Activity } from 'lucide-react';

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
    // Basic duplicate check
    if (logs.some(l => l.date === logData.date)) {
      alert("A log for this date already exists!");
      return;
    }

    const newLog = { ...logData, id: Date.now().toString() } as RoutineLog;
    addLog(newLog);
    alert("Routine logged successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-800">Log Daily Routine</h2>
          <p className="text-slate-500 text-sm">Track your habits to get better AI recommendations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={logData.date}
                onChange={e => setLogData({ ...logData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mood (1-10)</label>
              <input
                type="number"
                min="1" max="10"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                value={logData.moodRating}
                onChange={e => setLogData({ ...logData, moodRating: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <Sun size={18} className="text-orange-500" /> Sleep Schedule
              </h3>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Wake Up Time</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={logData.wakeUpTime}
                  onChange={e => setLogData({ ...logData, wakeUpTime: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Sleep Time</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={logData.sleepTime}
                  onChange={e => setLogData({ ...logData, sleepTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-indigo-500" /> Activities
              </h3>
              <div className="flex items-center gap-3">
                <BookOpen size={16} className="text-slate-400" />
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Study (Hours)</label>
                  <input
                    type="number" step="0.5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    value={logData.studyHours}
                    onChange={e => setLogData({ ...logData, studyHours: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
               <div className="flex items-center gap-3">
                <Monitor size={16} className="text-slate-400" />
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Screen Time (Hours)</label>
                  <input
                    type="number" step="0.5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    value={logData.screenTimeHours}
                    onChange={e => setLogData({ ...logData, screenTimeHours: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
             <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg shadow-indigo-100">
               <Save size={18} /> Save Daily Log
             </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent History</h3>
        <div className="space-y-2">
          {logs.slice(0, 5).map(log => (
            <div key={log.id} className="bg-white p-3 rounded-lg border border-slate-100 flex justify-between text-sm">
              <span className="font-medium text-slate-700">{new Date(log.date).toLocaleDateString()}</span>
              <span className="text-slate-500">Study: {Number(log.studyHours).toFixed(2)}h | Screen: {Number(log.screenTimeHours).toFixed(2)}h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};