import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { X, Pause, Play, RotateCcw, Minimize2, Maximize2, Zap } from 'lucide-react';

interface FocusTimerProps {
  task: Task;
  onClose: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ task, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Could play sound here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50 animate-slide-up">
        <div className="bg-indigo-900 text-white rounded-lg shadow-xl p-3 flex items-center gap-4 border border-indigo-700">
          <div className="flex flex-col">
             <span className="text-xs text-indigo-300 font-medium uppercase tracking-wider">Focusing</span>
             <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
          </div>
          <div className="h-8 w-[1px] bg-indigo-700"></div>
          <div className="flex items-center gap-2">
             <button onClick={() => setIsActive(!isActive)} className="p-1.5 hover:bg-indigo-800 rounded-full">
                {isActive ? <Pause size={16} /> : <Play size={16} />}
             </button>
             <button onClick={() => setIsMinimized(false)} className="p-1.5 hover:bg-indigo-800 rounded-full" title="Expand">
                <Maximize2 size={16} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden border border-slate-200">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setIsMinimized(true)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Minimize">
                <Minimize2 size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Close">
                <X size={20} />
            </button>
        </div>

        <div className="text-center space-y-8 mt-2">
            <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                    <Zap size={12} className="fill-current" /> Focus Mode
                </div>
                <h3 className="text-xl font-bold text-slate-800 line-clamp-1 px-4">{task.title}</h3>
                <p className="text-slate-500 text-sm mt-1">Eliminate distractions. Start working.</p>
            </div>

            <div className="relative">
                <div className="text-7xl font-mono font-bold text-slate-800 tracking-tight tabular-nums">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 ${isActive ? 'bg-amber-500 hover:bg-amber-600 ring-4 ring-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 ring-4 ring-indigo-100'}`}
                >
                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                    onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}
                    className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    title="Reset Timer"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};