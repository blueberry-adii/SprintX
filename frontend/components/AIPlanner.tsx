import React, { useState } from 'react';
import { analyzeProductivity } from '../services/geminiService';
import { Task, RoutineLog, UserProfile, AIAnalysisResult } from '../types';
import { Sparkles, Loader2, Calendar, Brain, Clock } from 'lucide-react';

interface AIPlannerProps {
  tasks: Task[];
  logs: RoutineLog[];
  profile: UserProfile;
}

export const AIPlanner: React.FC<AIPlannerProps> = ({ tasks, logs, profile }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await analyzeProductivity(tasks, logs, profile);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-10 text-white shadow-xl shadow-violet-200 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-white/20">
                <Sparkles size={12} /> Gemini Powered
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Smart Planner</h2>
            <p className="text-violet-100 max-w-lg leading-relaxed opacity-90">
                Optimize your schedule, identify unproductive habits, and maximize your academic performance with AI.
            </p>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-violet-50 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Brain size={20} />}
            {loading ? 'Analyzing...' : 'Generate Insights'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Insights Column */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20 h-full">
               <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                 <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 rounded-lg"><Brain size={20} /></div>
                 Key Insights
               </h3>
               <div className="space-y-3">
                 {analysis.insights.map((insight, idx) => (
                   <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 leading-relaxed">
                     {insight}
                   </div>
                 ))}
               </div>
               <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Productivity Score</p>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-5xl font-bold text-slate-800 dark:text-white tracking-tighter">{analysis.productivityScore}</span>
                    <span className="text-sm text-slate-400 mb-2 font-medium">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] rounded-full transition-all duration-1000" 
                      style={{ width: `${analysis.productivityScore}%` }}
                    ></div>
                  </div>
               </div>
             </div>
          </div>

          {/* Schedule Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
              <h3 className="font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-300)] rounded-lg"><Calendar size={20} /></div>
                Suggested Schedule for Today
              </h3>
              
              {/* Timeline Container */}
              <div className="relative space-y-8 before:absolute before:inset-y-2 before:left-28 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700 before:hidden md:before:block">
                {analysis.suggestedSchedule.map((item, idx) => {
                  const times = item.time.split(/[-–to]+/).map(t => t.trim());
                  const startTime = times[0];
                  const endTime = times[1];

                  return (
                    <div key={idx} className="relative flex flex-col md:flex-row gap-4 md:gap-0">
                      {/* Time Column */}
                      <div className="md:w-28 flex-shrink-0 flex flex-col md:items-end md:pr-8 md:text-right mb-2 md:mb-0 pt-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                          {startTime}
                        </div>
                        {endTime && (
                          <div className="text-xs text-slate-400 mt-1 font-medium">{endTime}</div>
                        )}
                      </div>

                      {/* Timeline Dot */}
                      <div className="hidden md:block absolute left-28 -ml-2 mt-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-[3px] border-[var(--primary-500)] z-10 shadow-sm"></div>

                      {/* Content Card */}
                      <div className="flex-1 md:pl-8">
                        <div className="bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:border-[var(--primary-200)] dark:hover:border-[var(--primary-700)] transition-all group">
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{item.activity}</h4>
                          {item.note && <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.note}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
