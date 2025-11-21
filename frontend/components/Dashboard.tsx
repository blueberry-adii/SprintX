import React, { useMemo, useState } from 'react';
import { RoutineLog, Task } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, Cell
} from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, CheckCircle2, Clock, Activity, X, Sparkles, Loader2, ArrowUpRight } from 'lucide-react';
import { getDailyScoreAnalysis } from '../services/geminiService';

interface DashboardProps {
  logs: RoutineLog[];
  tasks: Task[];
  userName: string;
  onNavigate: (tab: string) => void;
}

// Custom Tooltip Component for better Dark Mode support
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 text-left animate-fade-in z-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
                {payload.map((p: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm mb-1.5 last:mb-0">
                        <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: p.color }}></div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium min-w-[80px]">{p.name}:</span>
                        <span className="text-slate-900 dark:text-white font-bold">
                            {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
                            {p.name.toLowerCase().includes('mood') ? '' : ' hrs'}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ logs, tasks, userName, onNavigate }) => {
  // Initialize selectedDate to today
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  });

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay(); 
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  // Score Analysis Modal State
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreAnalysis, setScoreAnalysis] = useState<{ analysis: string; tip: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScoreCardZooming, setIsScoreCardZooming] = useState(false);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  // Memoized data for the week view
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      d.setHours(0,0,0,0);
      const dateStr = d.toISOString().split('T')[0];
      
      const foundLog = logs.find(l => l.date === dateStr);
      
      days.push({
        fullDate: new Date(d),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateDisplay: d.getDate(),
        dateStr: dateStr,
        study: foundLog ? foundLog.studyHours : 0,
        screen: foundLog ? foundLog.screenTimeHours : 0,
        mood: foundLog ? foundLog.moodRating : 0,
        hasLog: !!foundLog
      });
    }
    return days;
  }, [currentWeekStart, logs]);

  const selectedDateStr = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);

  // Compute stats specifically for the selected day
  const dayStats = useMemo(() => {
    // Filter tasks due on selected date
    const dayTasks = tasks.filter(t => t.deadline.startsWith(selectedDateStr));
    const dayCompleted = dayTasks.filter(t => t.completed).length;

    // Get log for selected date
    const log = logs.find(l => l.date === selectedDateStr);

    // Calculate Productivity Score
    let score = 0;
    let trend = 'No Data';
    
    if (log) {
        // Simple heuristic: Study Hours (weighted 60%) + Mood (weighted 40%)
        // Assuming 6 hours study is 100% for that part
        const studyScore = Math.min(100, (log.studyHours / 6) * 100);
        const moodScore = (log.moodRating / 10) * 100;
        score = Math.round(studyScore * 0.6 + moodScore * 0.4);
        
        if (score >= 80) trend = "Excellent Flow";
        else if (score >= 60) trend = "Good Progress";
        else if (score >= 40) trend = "Moderate";
        else trend = "Low Activity";
    }

    return {
        tasksCount: dayTasks.length,
        tasksCompleted: dayCompleted,
        studyHours: log?.studyHours || 0,
        mood: log?.moodRating || 0,
        prodScore: score,
        prodTrend: trend,
        hasLog: !!log
    };
  }, [selectedDateStr, tasks, logs]);

  const weekLabel = useMemo(() => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return `${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }, [currentWeekStart]);

  const firstName = useMemo(() => {
      return userName ? userName.split(' ')[0] : 'Scholar';
  }, [userName]);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
  const isToday = selectedDateStr === new Date().toISOString().split('T')[0];

  const handleScoreClick = async () => {
    if (!dayStats.hasLog) {
        alert("Please log your routine for this date to see the analysis!");
        return;
    }
    
    // Start Animation
    setIsScoreCardZooming(true);

    // Initiate fetch immediately
    setIsAnalyzing(true);
    setScoreAnalysis(null);
    
    const fetchPromise = getDailyScoreAnalysis(selectedDate.toLocaleDateString(), {
        studyHours: dayStats.studyHours,
        mood: dayStats.mood,
        completed: dayStats.tasksCompleted,
        total: dayStats.tasksCount,
        score: dayStats.prodScore
    });

    // Wait for zoom animation before opening modal
    setTimeout(async () => {
        setIsScoreModalOpen(true);
        setIsScoreCardZooming(false);
        
        try {
            const result = await fetchPromise;
            setScoreAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    }, 300);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Score Analysis Modal */}
      {isScoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className={`bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-pop border border-white/20 relative flex flex-col transition-all duration-500`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative overflow-hidden flex-shrink-0 z-10 transition-all duration-500">
                    <button 
                        onClick={() => setIsScoreModalOpen(false)} 
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-50"
                    >
                        <X size={20} />
                    </button>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            {isAnalyzing ? <Loader2 size={20} className="animate-spin text-amber-200" /> : <Sparkles size={20} className="text-amber-200" />}
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-100">
                                {isAnalyzing ? 'Analyzing Performance...' : 'AI Performance Deep Dive'}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold">
                            {isAnalyzing ? 'Crunching Numbers' : 'Score Analysis'}
                        </h2>
                        <p className="text-amber-100 opacity-90">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    
                    {/* Loading Progress Bar */}
                    {isAnalyzing && (
                         <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10 overflow-hidden">
                            <div className="h-full bg-white/50 w-1/2 animate-slide-indeterminate"></div>
                         </div>
                    )}

                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                </div>

                {/* Body - Collapsible */}
                <div 
                    className={`
                        bg-white dark:bg-slate-800 
                        transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                        overflow-hidden
                        ${isAnalyzing ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'}
                    `}
                >
                    <div className="p-8 space-y-6">
                        {/* The Score */}
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-slate-800 dark:text-white tracking-tighter">{dayStats.prodScore}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Score</div>
                            </div>
                            <div className="h-12 w-px bg-slate-100 dark:bg-slate-700"></div>
                            <div className="space-y-2 flex-1 pl-6">
                                {/* Mini breakdown bars */}
                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        <span>Mood Impact</span>
                                        <span>{dayStats.mood}/10</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(dayStats.mood / 10) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        <span>Study Volume</span>
                                        <span>{dayStats.studyHours.toFixed(1)}h</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-[var(--primary-500)] rounded-full" style={{ width: `${Math.min(100, (dayStats.studyHours / 6) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

                        {/* AI Output */}
                        <div className="min-h-[140px]">
                            {scoreAnalysis ? (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                                            <Activity size={16} className="text-slate-400" /> Analysis
                                        </h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {scoreAnalysis.analysis}
                                        </p>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50">
                                        <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                                            <Sparkles size={16} /> Tip for Tomorrow
                                        </h4>
                                        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                            {scoreAnalysis.tip}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                                    Analysis unavailable at this time.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-500)] rounded-3xl p-8 text-white shadow-xl shadow-[var(--primary-600)]/20 relative overflow-hidden transition-transform hover:scale-[1.01] duration-500">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{greeting}, {firstName}!</h2>
            <p className="text-[var(--primary-50)] max-w-xl text-lg opacity-90">
                {isToday 
                    ? `You've got ${dayStats.tasksCount - dayStats.tasksCompleted} pending tasks today.` 
                    : `Viewing summary for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`
                }
            </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-20 -mb-8 w-40 h-40 bg-[var(--primary-200)] opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* Week Navigator */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-[var(--primary-600)] transition-all active:scale-90">
                <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 px-4 py-1.5 rounded-full shadow-sm">
                <CalendarIcon size={16} className="text-[var(--primary-500)]" />
                <span className="text-sm tracking-tight">{weekLabel}</span>
            </div>
            <button onClick={handleNextWeek} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-[var(--primary-600)] transition-all active:scale-90">
                <ChevronRight size={20} />
            </button>
        </div>
        <div className="grid grid-cols-7 p-4 gap-2 text-center">
            {weeklyData.map((day, idx) => {
                const isSelected = day.dateStr === selectedDateStr;
                const isCurrentDay = new Date().toISOString().split('T')[0] === day.dateStr;
                
                return (
                    <button 
                        key={idx} 
                        onClick={() => setSelectedDate(day.fullDate)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-600)]/30 scale-105 ring-2 ring-[var(--primary-200)] dark:ring-slate-600' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-105'}`}
                    >
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-[var(--primary-100)]' : 'text-slate-400'}`}>{day.dayName}</span>
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                            isSelected 
                                ? 'bg-white/20 text-white' 
                                : isCurrentDay 
                                    ? 'bg-[var(--primary-100)] text-[var(--primary-700)] dark:bg-[var(--primary-600)]/20 dark:text-[var(--primary-200)]' 
                                    : day.hasLog 
                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' 
                                        : 'text-slate-400 dark:text-slate-500'
                        }`}>
                            {day.dateDisplay}
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            isSelected 
                                ? 'bg-white' 
                                : day.hasLog 
                                    ? 'bg-[var(--primary-400)]' 
                                    : 'bg-transparent'
                        }`}></div>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Day Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks Card */}
        <button 
            onClick={() => onNavigate('tasks')}
            className="text-left bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group w-full cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 dark:!bg-indigo-900/30 text-indigo-600 dark:!text-indigo-300 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 size={24} />
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">
                    Daily Tasks
                </h3>
             </div>
             <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-full text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowUpRight size={16} />
             </div>
          </div>
          <div className="flex items-baseline gap-2">
             <p className="text-4xl font-bold text-slate-800 dark:text-white">{dayStats.tasksCount}</p>
             <span className="text-sm text-slate-400 font-medium">due today</span>
          </div>
          <div className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2 py-0.5 rounded-md">
             {dayStats.tasksCompleted} Completed
          </div>
        </button>

        {/* Study Time Card */}
        <button 
            onClick={() => onNavigate('pomodoro')}
            className="text-left bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group w-full cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--primary-50)] dark:!bg-slate-700 text-[var(--primary-600)] dark:!text-[var(--primary-300)] rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Clock size={24} />
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Study Time</h3>
             </div>
             <div className="bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 p-1.5 rounded-full text-[var(--primary-600)] dark:text-[var(--primary-400)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowUpRight size={16} />
             </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-[var(--primary-600)] dark:!text-[var(--primary-400)]">
                {Number(dayStats.studyHours).toFixed(2)}
            </p>
            <span className="text-sm text-slate-400 font-medium">hours</span>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">
            {dayStats.hasLog ? "Logged today" : "No logs recorded yet"}
          </span>
        </button>

        {/* Productivity / Score Card (CLICKABLE) */}
        <button 
            onClick={handleScoreClick}
            className={`text-left bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 group relative overflow-hidden ${isScoreCardZooming ? 'scale-110 z-10 ring-4 ring-amber-200' : 'hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-700/50 hover:-translate-y-1'}`}
        >
          {/* Decorative gradient glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:!bg-amber-900/20 text-amber-600 dark:!text-amber-400 rounded-xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30">
                        <Activity size={24} />
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Daily Score</h3>
                </div>
                {dayStats.hasLog && (
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                        <ArrowUpRight size={16} />
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {dayStats.hasLog ? dayStats.prodScore : '-'}
                </p>
                <span className="text-sm text-slate-400 font-medium">{dayStats.hasLog ? '/ 100' : 'N/A'}</span>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md mt-2 inline-block ${dayStats.hasLog ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 bg-slate-100 dark:bg-slate-700'}`}>
                {dayStats.hasLog ? dayStats.prodTrend : 'Track habits to see score'}
            </span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study vs Screen Time Chart */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Weekly Trend</h3>
            <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 rounded-full bg-[var(--primary-500)]"></span> Study</div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-500"></span> Screen</div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--primary-100)" strokeOpacity={0.1} />
                <XAxis dataKey="dayName" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  tickFormatter={(val) => Number(val).toFixed(0)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'var(--primary-50)', opacity: 0.1}}
                  content={<CustomTooltip />}
                />
                {/* Highlight selected day in Bar Chart */}
                <Bar dataKey="study" name="Study Hours" radius={[6, 6, 6, 6]} barSize={16} animationDuration={1000}>
                    {weeklyData.map((entry, index) => (
                        <Cell key={`cell-study-${index}`} fill={entry.dateStr === selectedDateStr ? 'var(--primary-600)' : '#cbd5e1'} />
                    ))}
                </Bar>
                <Bar dataKey="screen" name="Screen Time" radius={[6, 6, 6, 6]} barSize={16} animationDuration={1000}>
                    {weeklyData.map((entry, index) => (
                        <Cell key={`cell-screen-${index}`} fill={entry.dateStr === selectedDateStr ? '#64748b' : '#e2e8f0'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood & Performance Correlation */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8">Wellbeing Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--primary-100)" strokeOpacity={0.1} />
                <XAxis dataKey="dayName" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} domain={[0, 10]} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="mood" 
                    name="Mood (1-10)" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                    animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};