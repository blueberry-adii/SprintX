import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Play, Pause, RotateCcw, CheckCircle, Zap, Coffee, Brain } from 'lucide-react';

interface PomodoroViewProps {
  tasks: Task[];
  initialTask?: Task | null;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({ tasks, initialTask }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTask?.id || '');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');

  useEffect(() => {
    if (initialTask) {
      setSelectedTaskId(initialTask.id);
    }
  }, [initialTask]);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound logic here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const switchMode = (newMode: 'focus' | 'short' | 'long') => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'focus') setTimeLeft(25 * 60);
    if (newMode === 'short') setTimeLeft(5 * 60);
    if (newMode === 'long') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? 25 * 60 : mode === 'short' ? 5 * 60 : 15 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // Dynamic styling helpers
  const getThemeClasses = () => {
      if (mode === 'focus') return 'text-[var(--primary-600)] bg-[var(--primary-600)]';
      if (mode === 'short') return 'text-sky-500 bg-sky-500';
      return 'text-violet-500 bg-violet-500';
  }

  const getBgGradient = () => {
      if (mode === 'focus') return 'from-[var(--primary-50)] dark:from-[var(--primary-900)]/30';
      if (mode === 'short') return 'from-sky-50 dark:from-sky-900/30';
      return 'from-violet-50 dark:from-violet-900/30';
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in h-full">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Timer Section */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden min-h-[450px] md:min-h-[500px]">
             {/* Background decoration */}
             <div className={`absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-700`}>
                <div 
                    className={`h-full transition-all duration-1000 ease-linear ${getThemeClasses().split(' ')[1]}`}
                    style={{ width: `${progress}%` }} 
                />
             </div>
             <div className={`absolute top-0 inset-x-0 h-64 bg-gradient-to-b ${getBgGradient()} to-transparent opacity-50 pointer-events-none`}></div>

             {/* Mode Toggles */}
             <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl mb-8 md:mb-12 relative z-10">
                {(['focus', 'short', 'long'] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={`px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                            mode === m 
                            ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-md transform scale-105' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-600/50'
                        }`}
                    >
                        {m === 'focus' && <Zap size={16} className={mode === m ? 'text-[var(--primary-500)]' : ''}/>}
                        {m === 'short' && <Coffee size={16} className={mode === m ? 'text-sky-500' : ''}/>}
                        {m === 'long' && <Brain size={16} className={mode === m ? 'text-violet-500' : ''}/>}
                        <span className="capitalize">{m.replace('-', ' ')}</span>
                    </button>
                ))}
             </div>

             {/* Timer Display */}
             <div className="relative mb-12 md:mb-16 z-10">
                <div className={`text-7xl md:text-9xl font-mono font-bold tracking-tighter tabular-nums transition-colors duration-500 ${getThemeClasses().split(' ')[0]}`}>
                    {formatTime(timeLeft)}
                </div>
                <div className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                    {isActive ? 'Session Active' : 'Timer Paused'}
                </div>
             </div>

             {/* Controls */}
             <div className="flex items-center gap-6 md:gap-8 z-10">
                 <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all transform active:scale-95 hover:-translate-y-1 ${getThemeClasses().split(' ')[0].replace('text', 'bg')} hover:brightness-110`}
                >
                    {isActive ? <Pause className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" /> : <Play className="w-8 h-8 md:w-10 md:h-10 ml-2" fill="currentColor" />}
                 </button>

                 <button 
                    onClick={() => { setIsActive(false); switchMode(mode); }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors"
                    title="Reset"
                 >
                    <RotateCcw className="w-6 h-6 md:w-7 md:h-7" />
                 </button>
             </div>
          </div>

          {/* Task Selection & Stats */}
          <div className="lg:col-span-5 space-y-6 flex flex-col h-auto lg:h-full">
             <div className={`rounded-3xl p-8 text-white shadow-lg transition-colors duration-500 flex-shrink-0 ${mode === 'focus' ? 'bg-[var(--primary-600)]' : mode === 'short' ? 'bg-sky-500' : 'bg-violet-500'}`}>
                 <div className="flex items-center gap-2 mb-4 opacity-90">
                    <div className="bg-white/20 p-1.5 rounded-lg"><Zap size={20} /></div>
                    <h2 className="font-bold tracking-wide text-sm uppercase">Current Objective</h2>
                 </div>
                 {selectedTask ? (
                     <div className="animate-fade-in">
                         <h3 className="text-2xl font-bold leading-snug mb-3 line-clamp-2">{selectedTask.title}</h3>
                         <div className="flex flex-wrap gap-2 text-white/90 text-xs font-bold">
                            <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">{selectedTask.category}</span>
                            <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">{selectedTask.durationMinutes} mins</span>
                         </div>
                     </div>
                 ) : (
                     <div className="text-white/80 italic font-medium">
                         No task selected. Pick one from the list below to track your progress.
                     </div>
                 )}
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex-1 flex flex-col min-h-[300px]">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 px-2">Up Next</h3>
                <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                    {tasks.filter(t => !t.completed).map(task => (
                        <button
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                                selectedTaskId === task.id
                                ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 border-[var(--primary-500)]/50 shadow-sm'
                                : 'bg-white dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 hover:border-[var(--primary-200)] hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            <div>
                                <div className={`font-bold text-sm ${selectedTaskId === task.id ? 'text-[var(--primary-900)] dark:text-[var(--primary-100)]' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {task.title}
                                </div>
                                <div className="text-xs text-slate-400 mt-1 font-medium">{task.category}</div>
                            </div>
                            {selectedTaskId === task.id && <CheckCircle size={20} className="text-[var(--primary-600)]" />}
                        </button>
                    ))}
                    {tasks.filter(t => !t.completed).length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                            <p>All tasks completed!</p>
                        </div>
                    )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};