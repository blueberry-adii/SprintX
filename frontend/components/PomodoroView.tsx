import React, { useState, useEffect, useRef } from 'react';
import { RoutineLog, Task } from '../types';
import { Play, Pause, RotateCcw, CheckCircle, Zap, Coffee, Brain, Maximize2, X, Clock } from 'lucide-react';

interface PomodoroViewProps {
  tasks: Task[];
  logs: RoutineLog[];
  initialTask?: Task | null;
  isMinimized?: boolean;
  onMaximize?: () => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({ tasks, logs, initialTask, isMinimized = false, onMaximize }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTask?.id || '');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  
  // State to track if the user manually dismissed the floating window
  const [isFloatingDismissed, setIsFloatingDismissed] = useState(false);

  // Draggable state
  const [position, setPosition] = useState(() => ({ 
    x: Math.max(20, window.innerWidth - 360), 
    y: 100 
  }));
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  // Calculate today's study time
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);
  const totalStudyHours = todayLog ? todayLog.studyHours : 0;

  useEffect(() => {
    if (initialTask) {
      setSelectedTaskId(initialTask.id);
    }
  }, [initialTask]);

  // Reset floating dismissal when user returns to full view
  useEffect(() => {
    if (!isMinimized) {
      setIsFloatingDismissed(false);
    }
  }, [isMinimized]);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play sound or notification here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Drag & Drop Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartOffset.current.x,
        y: e.clientY - dragStartOffset.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent drag start if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    dragStartOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

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
      if (mode === 'focus') return 'from-[var(--primary-50)] dark:from-[var(--primary-600)]/20';
      if (mode === 'short') return 'from-sky-50 dark:from-sky-900/30';
      return 'from-violet-50 dark:from-violet-900/30';
  }

  // --- Minimized Floating View ---
  if (isMinimized) {
    // Render nothing if dismissed or if the timer isn't active (and is at start)
    if (isFloatingDismissed || (!isActive && timeLeft === totalTime)) return null;

    return (
      <div 
        className="fixed z-[100] shadow-2xl rounded-2xl overflow-hidden cursor-move select-none border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md w-80 transition-transform active:scale-[0.99] animate-slide-up"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Handle / Header */}
        <div className="bg-slate-50/50 dark:bg-slate-700/50 p-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 pointer-events-none">
                <div className={`p-1 rounded-md ${mode === 'focus' ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : mode === 'short' ? 'bg-sky-100 text-sky-600' : 'bg-violet-100 text-violet-600'}`}>
                    {mode === 'focus' ? <Zap size={12} /> : mode === 'short' ? <Coffee size={12} /> : <Brain size={12} />}
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    {mode === 'focus' ? 'Focus' : 'Break'}
                </span>
            </div>
            <div className="flex items-center gap-1">
                <button 
                    onClick={onMaximize} 
                    className="p-1.5 text-slate-400 hover:text-[var(--primary-600)] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" 
                    title="Maximize"
                >
                    <Maximize2 size={14} />
                </button>
                <button 
                    onClick={() => setIsFloatingDismissed(true)} 
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" 
                    title="Close (Keep Running)"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
        
        {/* Body */}
        <div className="p-4">
            <div className="flex items-center justify-between gap-4">
                <div className={`text-4xl font-mono font-bold tracking-tighter pointer-events-none ${getThemeClasses().split(' ')[0]}`}>
                    {formatTime(timeLeft)}
                </div>
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform active:scale-95 hover:brightness-110 ${getThemeClasses().split(' ')[1]}`}
                >
                    {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
            </div>
            <div className="mt-3 bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden pointer-events-none">
                <div 
                    className={`h-full transition-all duration-1000 ease-linear ${getThemeClasses().split(' ')[1]}`}
                    style={{ width: `${progress}%` }} 
                />
            </div>
        </div>
      </div>
    );
  }

  // --- Full View ---
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
             <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 p-2 bg-slate-100/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl mb-8 md:mb-12 relative z-10 border border-white/50 dark:border-slate-600 shadow-sm">
                
                <button
                    onClick={() => switchMode('focus')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                        mode === 'focus' 
                        ? 'bg-white dark:bg-slate-600 text-[var(--primary-600)] dark:text-white shadow-md ring-1 ring-slate-200 dark:ring-slate-500' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-600/50'
                    }`}
                >
                    <Zap size={18} className={mode === 'focus' ? "fill-current" : ""} />
                    Focus
                </button>

                <div className="hidden md:block w-px h-8 bg-slate-300 dark:bg-slate-600 mx-2"></div>

                <div className="flex items-center gap-1 p-1.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/50">
                    <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Break</span>
                    
                    <button
                        onClick={() => switchMode('short')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                            mode === 'short' 
                            ? 'bg-white dark:bg-slate-600 text-sky-500 dark:text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        <Coffee size={14} />
                        Short
                    </button>
                    
                    <button
                        onClick={() => switchMode('long')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                            mode === 'long' 
                            ? 'bg-white dark:bg-slate-600 text-violet-500 dark:text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        <Brain size={14} />
                        Long
                    </button>
                </div>
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
             
             {/* Daily Focus Stats */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm animate-fade-in">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)] rounded-xl">
                      <Clock size={24} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Focus</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalStudyHours.toFixed(2)}<span className="text-sm text-slate-400 font-medium ml-1">hrs</span></div>
                   </div>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                       Logged Today
                    </div>
                </div>
             </div>

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
                            onClick={() => setSelectedTaskId(selectedTaskId === task.id ? '' : task.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                                selectedTaskId === task.id
                                ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/10 border-[var(--primary-500)]/50 shadow-sm'
                                : 'bg-white dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 hover:border-[var(--primary-200)] hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            <div>
                                <div className={`font-bold text-sm ${selectedTaskId === task.id ? 'text-[var(--primary-700)] dark:text-[var(--primary-200)]' : 'text-slate-700 dark:text-slate-200'}`}>
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