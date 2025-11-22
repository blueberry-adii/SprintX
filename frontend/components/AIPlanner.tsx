import React, { useState, useEffect } from 'react';
import { analyzeProductivity } from '../services/geminiService';
import { Task, RoutineLog, UserProfile, AIAnalysisResult } from '../types';
import { Sparkles, Loader2, Calendar, Brain, History, ChevronRight, Clock } from 'lucide-react';
import { api } from '../services/api';

interface AIPlannerProps {
  tasks: Task[];
  logs: RoutineLog[];
  profile: UserProfile;
}

export const AIPlanner: React.FC<AIPlannerProps> = ({ tasks, logs, profile }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AIAnalysisResult[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<AIAnalysisResult | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get<{ data: AIAnalysisResult[] }>('/insights');
      // Assuming response structure matches ApiResponse { data: ... }
      const insights = response.data || [];
      // Sort by date descending if not already
      const sorted = insights.sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setHistory(sorted);
      if (sorted.length > 0 && !selectedInsight) {
        setSelectedInsight(sorted[0]);
      }
    } catch (error) {
      console.error("Failed to fetch insights history", error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await analyzeProductivity(tasks, logs, profile);
      // Add temporary ID/date if missing from backend response immediately (though backend should have it)
      if (!result.createdAt) result.createdAt = new Date().toISOString();
      if (!result.id) result.id = Date.now().toString();

      const newHistory = [result, ...history];
      setHistory(newHistory);
      setSelectedInsight(result);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown Date';
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    return isToday
      ? `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-100px)]">
      {/* Sidebar - History */}
      <div className={`lg:w-80 flex-shrink-0 flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20 overflow-hidden transition-all duration-300 ${showSidebar ? 'block' : 'hidden lg:block lg:w-0 lg:opacity-0 lg:p-0 lg:border-0'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <History size={20} className="text-[var(--primary-500)]" />
            History
          </h3>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{history.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] lg:max-h-none">
          {history.length === 0 ? (
            <div className="text-center text-slate-400 py-8 text-sm">
              No history yet. Generate your first insight!
            </div>
          ) : (
            history.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => {
                  setSelectedInsight(item);
                  // On mobile, close sidebar after selection
                  if (window.innerWidth < 1024) setShowSidebar(false);
                }}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedInsight === item
                  ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 border-[var(--primary-200)] dark:border-[var(--primary-700)] shadow-sm dark:text-slate-500'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] uppercase tracking-wider">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-600 line-clamp-2">
                  {item.insights[0]}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary-500)]" style={{ width: `${item.productivityScore}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{item.productivityScore}%</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[500px]">
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-violet-200 dark:shadow-none relative overflow-hidden flex-shrink-0 mb-6">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-white/20">
                <Sparkles size={12} /> Gemini Powered
              </div>
              <h2 className="text-2xl font-bold mb-1 tracking-tight">Smart Planner</h2>
              <p className="text-violet-100 text-sm opacity-90">
                Optimize your schedule and habits with AI.
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all flex-shrink-0"
              >
                <History size={20} />
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 md:flex-none justify-center bg-white text-violet-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-violet-50 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Brain size={18} />}
                {loading ? 'Analyzing...' : 'New Insight'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {selectedInsight ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in pb-6">
              {/* Insights Column */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 rounded-lg"><Brain size={20} /></div>
                    Key Insights
                  </h3>
                  <div className="space-y-3">
                    {selectedInsight.insights.map((insight, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 leading-relaxed">
                        {insight}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Productivity Score</p>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-5xl font-bold text-slate-800 dark:text-white tracking-tighter">{selectedInsight.productivityScore}</span>
                      <span className="text-sm text-slate-400 mb-2 font-medium">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] rounded-full transition-all duration-1000"
                        style={{ width: `${selectedInsight.productivityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Column */}
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                    <div className="p-2 bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-300)] rounded-lg"><Calendar size={20} /></div>
                    Suggested Schedule
                  </h3>

                  {/* Timeline Container */}
                  <div className="relative space-y-8 before:absolute before:inset-y-2 before:left-28 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700 before:hidden md:before:block">
                    {selectedInsight.suggestedSchedule.map((item, idx) => {
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
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-50">
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-4">
                <Sparkles size={48} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500">No Insight Selected</h3>
              <p className="text-slate-400 max-w-xs mt-2">Select an item from history or generate a new insight to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};