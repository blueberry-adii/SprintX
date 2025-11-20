import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskManager } from './components/TaskManager';
import { RoutineLogger } from './components/RoutineLogger';
import { AIPlanner } from './components/AIPlanner';
import { storageService } from './services/storageService';
import { Task, RoutineLog, UserProfile } from './types';

// Simple Profile Component inline for brevity
const ProfileView = ({ profile }: { profile: UserProfile }) => (
  <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
        {profile.name.charAt(0)}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
        <p className="text-slate-500">Student</p>
      </div>
    </div>
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Academic Goals</h3>
        <ul className="list-disc list-inside text-slate-600 space-y-1">
          {profile.goals.map((g, i) => <li key={i}>{g}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Upcoming Exams</h3>
        <div className="grid gap-3">
          {profile.examDates.map((exam, i) => (
            <div key={i} className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">{exam.subject}</span>
              <span className="text-slate-500 text-sm">{exam.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<RoutineLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '', goals: [], examDates: [] });

  // Load initial data
  useEffect(() => {
    setTasks(storageService.getTasks());
    setLogs(storageService.getLogs());
    setProfile(storageService.getProfile());
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (tasks.length > 0) storageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    if (logs.length > 0) storageService.saveLogs(logs);
  }, [logs]);

  const handleAddLog = (log: RoutineLog) => {
    setLogs([log, ...logs]);
  };

  return (
    <Layout currentTab={currentTab} setTab={setCurrentTab}>
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 capitalize">
          {currentTab === 'ai' ? 'AI Insights' : currentTab.replace('-', ' ')}
        </h2>
        <p className="text-slate-500 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {currentTab === 'dashboard' && <Dashboard logs={logs} tasks={tasks} />}
      {currentTab === 'tasks' && <TaskManager tasks={tasks} setTasks={setTasks} />}
      {currentTab === 'routine' && <RoutineLogger logs={logs} addLog={handleAddLog} />}
      {currentTab === 'ai' && <AIPlanner tasks={tasks} logs={logs} profile={profile} />}
      {currentTab === 'profile' && <ProfileView profile={profile} />}
    </Layout>
  );
};

export default App;
