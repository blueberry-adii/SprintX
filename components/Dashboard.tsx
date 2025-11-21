import React, { useMemo, useState } from 'react';
import { RoutineLog, Task } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

interface DashboardProps {
  logs: RoutineLog[];
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ logs, tasks }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay(); 
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

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

  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const foundLog = logs.find(l => l.date === dateStr);
      
      days.push({
        fullDate: d,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateDisplay: d.getDate(),
        study: foundLog ? foundLog.studyHours : 0,
        screen: foundLog ? foundLog.screenTimeHours : 0,
        mood: foundLog ? foundLog.moodRating : 0,
        hasLog: !!foundLog
      });
    }
    return days;
  }, [currentWeekStart, logs]);

  const completionStats = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending }
    ];
  }, [tasks]);

  const weekStats = useMemo(() => {
    const totalStudy = weeklyData.reduce((acc, d) => acc + d.study, 0);
    
    return {
        avgStudy: (totalStudy / 7).toFixed(2),
        totalStudy: totalStudy.toFixed(2)
    };
  }, [weeklyData]);

  const weekLabel = useMemo(() => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return `${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }, [currentWeekStart]);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-500)] rounded-3xl p-8 text-white shadow-xl shadow-[var(--primary-600)]/20 relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{greeting}, Scholar!</h2>
            <p className="text-[var(--primary-50)] max-w-xl text-lg opacity-90">
                You've got {completionStats[1].value} pending tasks today. Ready to make some progress?
            </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 -mb-8 w-40 h-40 bg-[var(--primary-200)] opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* Week Navigator */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-[var(--primary-600)] transition-colors">
                <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 px-4 py-1.5 rounded-full">
                <CalendarIcon size={16} className="text-[var(--primary-500)]" />
                <span className="text-sm tracking-tight">{weekLabel}</span>
            </div>
            <button onClick={handleNextWeek} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-[var(--primary-600)] transition-colors">
                <ChevronRight size={20} />
            </button>
        </div>
        <div className="grid grid-cols-7 p-4 gap-2 text-center">
            {weeklyData.map((day, idx) => {
                const isToday = new Date().toISOString().split('T')[0] === day.fullDate.toISOString().split('T')[0];
                return (
                    <div key={idx} className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${isToday ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 ring-1 ring-[var(--primary-200)] shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day.dayName}</span>
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${day.hasLog ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' : 'text-slate-600 dark:text-slate-400'} ${isToday ? 'bg-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-200)] dark:shadow-none' : ''}`}>
                            {day.dateDisplay}
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${day.hasLog ? 'bg-[var(--primary-400)]' : 'bg-transparent'}`}></div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 size={24} />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Total Tasks</h3>
          </div>
          <div className="flex items-baseline gap-2">
             <p className="text-4xl font-bold text-slate-800 dark:text-white">{tasks.length}</p>
             <span className="text-sm text-slate-400 font-medium">items</span>
          </div>
          <div className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2 py-0.5 rounded-md">
             {completionStats[0].value} Completed
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/10 text-[var(--primary-600)] dark:text-[var(--primary-300)] rounded-xl group-hover:scale-110 transition-transform">
                <Clock size={24} />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Avg. Study</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)]">{weekStats.avgStudy}</p>
            <span className="text-sm text-slate-400 font-medium">hrs/day</span>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">Based on logs this week</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-2">
             <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
             </div>
             <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Productivity</h3>
          </div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white">Top 12%</p>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md mt-2 inline-block">
            ↑ Rising trend
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study vs Screen Time Chart */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Study vs. Screen Time</h3>
            <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 rounded-full bg-[var(--primary-500)]"></span> Study</div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-500"></span> Screen</div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--primary-100)" strokeOpacity={0.2} />
                <XAxis dataKey="dayName" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  tickFormatter={(val) => Number(val).toFixed(0)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'var(--primary-50)', opacity: 0.1}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#1e293b' }}
                  formatter={(value: number) => [value.toFixed(2), 'Hours']}
                />
                <Bar dataKey="study" name="Study Hours" fill="var(--primary-600)" radius={[6, 6, 6, 6]} barSize={16} />
                <Bar dataKey="screen" name="Screen Time" fill="#cbd5e1" radius={[6, 6, 6, 6]} barSize={16} />
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--primary-100)" strokeOpacity={0.2} />
                <XAxis dataKey="dayName" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} domain={[0, 10]} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area 
                    type="monotone" 
                    dataKey="mood" 
                    name="Mood (1-10)" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};