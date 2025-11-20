import React, { useState } from 'react';
import { analyzeProductivity } from '../services/geminiService';
import { Task, RoutineLog, UserProfile, AIAnalysisResult } from '../types';
import { Sparkles, Loader2, Calendar, Brain, TrendingUp } from 'lucide-react';

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
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">AI Smart Planner</h2>
          <p className="text-indigo-100 mb-6 max-w-lg">
            Let our Gemini-powered engine optimize your schedule, identify unproductive habits, and maximize your academic performance.
          </p>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? 'Analyzing Data...' : 'Generate Productivity Insights'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Insights Column */}
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Brain size={20} className="text-purple-500" /> Key Insights
               </h3>
               <div className="space-y-4">
                 {analysis.insights.map((insight, idx) => (
                   <div key={idx} className="p-3 bg-purple-50 rounded-lg text-sm text-purple-900 border border-purple-100">
                     {insight}
                   </div>
                 ))}
               </div>
               <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Productivity Score</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-slate-800">{analysis.productivityScore}</span>
                    <span className="text-sm text-slate-400 mb-2">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                      style={{ width: `${analysis.productivityScore}%` }}
                    ></div>
                  </div>
               </div>
             </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-500" /> Suggested Schedule for Today
              </h3>
              <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-20 before:w-0.5 before:bg-slate-100">
                {analysis.suggestedSchedule.map((item, idx) => (
                  <div key={idx} className="flex gap-6 relative mb-6 last:mb-0 group">
                    <div className="w-20 text-right text-sm font-medium text-slate-500 pt-1">
                      {item.time}
                    </div>
                    <div className="flex-1 p-4 bg-white border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-100">
                      <h4 className="font-semibold text-slate-800">{item.activity}</h4>
                      {item.note && <p className="text-xs text-slate-500 mt-1">{item.note}</p>}
                    </div>
                    <div className="absolute left-20 -ml-1.5 mt-2 w-3 h-3 rounded-full bg-indigo-100 border-2 border-indigo-500"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
