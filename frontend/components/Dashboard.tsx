import React, { useMemo, useState } from 'react';
import { RoutineLog, Task, DashboardStats } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

interface DashboardProps {
  logs: RoutineLog[];
  tasks: Task[];
  userName: string;
  stats?: DashboardStats | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ logs, tasks, userName, stats }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date(Date.now());
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

      // Manual YYYY-MM-DD formatting to ensure consistency with logs and avoid locale issues
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const foundLog = logs.find(l => {
        // Parse log date as local time to handle timezone offsets correctly
        const logD = new Date(l.date);
        const logDate = `${logD.getFullYear()}-${String(logD.getMonth() + 1).padStart(2, '0')}-${String(logD.getDate()).padStart(2, '0')}`;

        // console.log(`Comparing Log: ${logDate} with Column: ${dateStr}`);
        return logDate === dateStr;
      });

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
    const totalStudy = weeklyData.reduce((acc, d) => acc + (Number(d.study) || 0), 0);

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

  const firstName = useMemo(() => {
    return userName ? userName.split(' ')[0] : 'Scholar';
  }, [userName]);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-500)] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-[var(--primary-600)]/20 relative overflow-hidden transition-transform hover:scale-[1.01] duration-500">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{greeting}, {firstName}!</h2>
          <p className="text-[var(--primary-50)] max-w-xl text-base md:text-lg opacity-90">
            You've got {completionStats[1].value} pending tasks today. Ready to make some progress?
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
        <div className="grid grid-cols-7 gap-1 p-2 sm:gap-2 sm:p-4">
          {weeklyData.map((day, idx) => {
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const dayStr = `${day.fullDate.getFullYear()}-${String(day.fullDate.getMonth() + 1).padStart(2, '0')}-${String(day.fullDate.getDate()).padStart(2, '0')}`;
            const isToday = todayStr === dayStr;

            return (
              <div key={idx} className={`flex flex-col items-center gap-1 sm:gap-2 p-1 sm:p-3 rounded-2xl transition-all duration-300 ${isToday ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 ring-1 ring-[var(--primary-200)] shadow-sm scale-105' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-105'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day.dayName}</span>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${day.hasLog ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' : 'text-slate-600 dark:text-slate-400'} ${isToday ? 'bg-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-200)] dark:shadow-none' : ''}`}>
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
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-xl group-hover:scale-110 transition-transform duration-300">
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

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/10 text-[var(--primary-600)] dark:text-[var(--primary-300)] rounded-xl group-hover:scale-110 transition-transform duration-300">
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

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wide truncate">Productivity</h3>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white truncate">
            {stats ? `${stats.productivity_score}%` : '0%'}
          </p>
          <div className="mt-2 flex flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md inline-block ${stats && stats.productivity_change >= 0
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
              }`}>
              {stats && stats.productivity_change >= 0 ? '↑' : '↓'} {stats ? Math.abs(stats.productivity_change) : 0}% vs last week
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
                <XAxis dataKey="dayName" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(val) => Number(val).toFixed(0)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--primary-50)', opacity: 0.1 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#1e293b' }}
                  formatter={(value: any) => [Number(value).toFixed(2), 'Hours']}
                />
                <Bar dataKey="study" name="Study Hours" fill="var(--primary-600)" radius={[6, 6, 6, 6]} barSize={16} animationDuration={1000} />
                <Bar dataKey="screen" name="Screen Time" fill="#cbd5e1" radius={[6, 6, 6, 6]} barSize={16} animationDuration={1000} />
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
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--primary-100)" strokeOpacity={0.2} />
                <XAxis dataKey="dayName" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 10]} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
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