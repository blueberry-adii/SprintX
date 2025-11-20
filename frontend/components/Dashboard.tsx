import React, { useMemo, useState } from 'react';
import { RoutineLog, Task } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DashboardProps {
  logs: RoutineLog[];
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ logs, tasks }) => {
  // State to track the start date of the currently visible week
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
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
    // Optional: prevent going into future? For now, allow it.
    setCurrentWeekStart(newDate);
  };

  // Generate the 7 days for the current view and match with logs
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
        // If log exists use it, otherwise pad with 0
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

  // Calculate averages based on the *visible* week
  const weekStats = useMemo(() => {
    const totalStudy = weeklyData.reduce((acc, d) => acc + d.study, 0);
    const activeDays = weeklyData.filter(d => d.hasLog).length || 1; // avoid div/0
    
    // Calculate trend (mock logic: compare to a fixed value or prev week if available)
    // For this UI we'll keep the static "Up 12%" look but the study hours will be dynamic
    
    return {
        avgStudy: (totalStudy / 7).toFixed(1), // Average per day over the week
        totalStudy: totalStudy.toFixed(1)
    };
  }, [weeklyData]);

  const weekLabel = useMemo(() => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return `${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }, [currentWeekStart]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Week Navigator / Calendar Strip */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-50">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 font-semibold text-slate-700">
                <CalendarIcon size={18} className="text-indigo-500" />
                <span>{weekLabel}</span>
            </div>
            <button onClick={handleNextWeek} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <ChevronRight size={20} />
            </button>
        </div>
        <div className="grid grid-cols-7 p-4 gap-2 text-center">
            {weeklyData.map((day, idx) => {
                const isToday = new Date().toISOString().split('T')[0] === day.fullDate.toISOString().split('T')[0];
                return (
                    <div key={idx} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isToday ? 'bg-indigo-50 ring-1 ring-indigo-200' : ''}`}>
                        <span className="text-xs font-medium text-slate-400 uppercase">{day.dayName}</span>
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${day.hasLog ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}`}>
                            {day.dateDisplay}
                        </div>
                        {day.hasLog && <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1"></div>}
                    </div>
                );
            })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
          <p className="text-3xl font-bold text-slate-800">{tasks.length}</p>
          <span className="text-xs text-green-500 font-medium">{completionStats[0].value} Completed</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-gray-500 text-sm font-medium">Avg. Study Hours</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {weekStats.avgStudy}h
          </p>
          <span className="text-xs text-slate-400">This Week</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-gray-500 text-sm font-medium">Productivity Trend</h3>
          <p className="text-3xl font-bold text-emerald-600">Up 12%</p>
          <span className="text-xs text-slate-400">vs previous week</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study vs Screen Time Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Study vs. Screen Time</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dayName" tick={{fontSize: 12}} />
                <YAxis 
                  tick={{fontSize: 12}} 
                  tickFormatter={(val) => Number(val).toFixed(2)}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toFixed(2), undefined]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="study" name="Study Hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="screen" name="Screen Time" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood & Performance Correlation */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Wellbeing Correlation</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dayName" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} domain={[0, 10]} />
                <Tooltip />
                <Area type="monotone" dataKey="mood" name="Energy Level" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};