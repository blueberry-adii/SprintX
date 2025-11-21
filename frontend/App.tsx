import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskManager } from './components/TaskManager';
import { RoutineLogger } from './components/RoutineLogger';
import { AIPlanner } from './components/AIPlanner';
import { SettingsView } from './components/SettingsView';
import { storageService } from './services/storageService';
import { Task, RoutineLog, UserProfile } from './types';
import { Pencil, Save, X, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { AIAssistant } from './components/AIAssistant';
import { PomodoroView } from './components/PomodoroView';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';

// ProfileView Component
const ProfileView = ({ profile, setProfile }: { profile: UserProfile, setProfile: (p: UserProfile) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = async () => {
    try {
      const updated = await storageService.saveProfile(editedProfile);
      setProfile(updated);
      setIsEditing(false);
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addGoal = () => {
    if (editedProfile.goals.length < 4) {
      setEditedProfile(prev => ({ ...prev, goals: [...prev.goals, ""] }));
    }
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...editedProfile.goals];
    newGoals[index] = value;
    setEditedProfile(prev => ({ ...prev, goals: newGoals }));
  };

  const removeGoal = (index: number) => {
    setEditedProfile(prev => ({ ...prev, goals: prev.goals.filter((_, i) => i !== index) }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative animate-fade-in transition-colors duration-300">
      <div className="absolute top-6 right-6 flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
              title="Cancel"
            >
              <X size={20} />
            </button>
            <button
              onClick={handleSave}
              className="p-2 bg-[var(--primary-600)] hover:brightness-110 rounded-full text-white transition-colors shadow-sm"
              title="Save Changes"
            >
              <Save size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
            title="Edit Profile"
          >
            <Pencil size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <div className="w-24 h-24 bg-[var(--primary-100)] rounded-full flex items-center justify-center text-[var(--primary-600)] text-4xl font-bold overflow-hidden border-4 border-white dark:border-slate-700 shadow-md">
            {editedProfile.profilePicture ? (
              <img src={editedProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (editedProfile.name || '?').charAt(0).toUpperCase()
            )}
          </div>
          {isEditing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
              <Upload size={24} />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                value={editedProfile.name}
                onChange={e => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="text-3xl font-bold text-slate-800 dark:text-white border-b-2 border-slate-200 dark:border-slate-700 focus:border-[var(--primary-600)] outline-none bg-transparent w-full py-1"
                placeholder="Enter your name"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{profile.name}</h2>
              <p className="text-[var(--primary-600)] font-medium">Student</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Academic Goals</h3>
            {isEditing && editedProfile.goals.length < 4 && (
              <button onClick={addGoal} className="text-sm text-[var(--primary-600)] font-medium flex items-center gap-1 hover:underline">
                <Plus size={16} /> Add Goal
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              {editedProfile.goals.map((goal, i) => (
                <div key={i} className="flex gap-2 group">
                  <input
                    type="text"
                    value={goal}
                    onChange={e => updateGoal(i, e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[var(--primary-500)]/20 focus:border-[var(--primary-500)] outline-none transition-all bg-slate-50 dark:bg-slate-900 dark:text-white"
                    placeholder={`Goal #${i + 1}`}
                    autoFocus={i === editedProfile.goals.length - 1 && goal === ""}
                  />
                  <button
                    onClick={() => removeGoal(i)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove Goal"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
              <ul className="space-y-3">
                {profile.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                    <div className="mt-1.5 w-2 h-2 bg-[var(--primary-500)] rounded-full flex-shrink-0 shadow-sm"></div>
                    <span className="leading-relaxed">{g}</span>
                  </li>
                ))}
                {profile.goals.length === 0 && <li className="text-slate-400 italic">No academic goals defined.</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Upcoming Exams</h3>
          <div className="grid gap-3">
            {profile.examDates.map((exam, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">{exam.subject}</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm rounded-full font-medium">{exam.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Persistence for Theme & Dark Mode
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('teal');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<RoutineLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: 'Guest Student', goals: [], examDates: [] });

  const [focusTask, setFocusTask] = useState<Task | null>(null);

  // Initialization Logic
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [t, l, p] = await Promise.all([
          storageService.getTasks(),
          storageService.getLogs(),
          storageService.getProfile()
        ]);
        setTasks(t);
        setLogs(l);
        setProfile(p);

        // Apply settings from profile
        if (p.settings) {
          setDarkMode(p.settings.darkMode);
          setTheme(p.settings.theme);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Save settings
  const handleToggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode); // Optimistic
    try {
      await storageService.toggleDarkMode();
    } catch (e) {
      console.error("Failed to toggle dark mode", e);
      setDarkMode(!newMode); // Revert on error
    }
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleSetTheme = async (newTheme: string) => {
    setTheme(newTheme); // Optimistic
    try {
      await storageService.changeTheme(newTheme);
    } catch (e) {
      console.error("Failed to change theme", e);
    }
  };

  const addTask = async (task: Task) => {
    try {
      const saved = await storageService.saveTask(task);
      setTasks(prev => [...prev, saved]);
    } catch (e) {
      console.error("Failed to add task", e);
    }
  };

  const updateTask = async (task: Task) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    try {
      await storageService.updateTask(task);
    } catch (e) {
      console.error("Failed to update task", e);
      // Revert or refetch could be added here
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const updated = { ...task, completed: !task.completed };
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      try {
        await storageService.updateTask(updated);
      } catch (e) {
        console.error("Failed to toggle task", e);
      }
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update for instant feedback
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await storageService.deleteTask(id);
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  };

  const handleAddLog = async (log: RoutineLog) => {
    try {
      const saved = await storageService.saveLog(log);
      setLogs([saved, ...logs]);
    } catch (e) {
      console.error("Failed to add log", e);
    }
  };

  const startFocusSession = (task: Task) => {
    setFocusTask(task);
    setCurrentTab('pomodoro');
  };

  // Theme Colors Definition
  const themeColors = useMemo(() => {
    const colors: Record<string, any> = {
      teal: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e' },
      violet: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
      blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
      orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' },
    };
    return colors[theme] || colors.teal;
  }, [theme]);

  if (loading && tasks.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="animate-spin text-violet-600" size={40} />
      </div>
    );
  }

  return (
    <Layout currentTab={currentTab} setTab={setCurrentTab}>
      {/* Inject Dynamic CSS Variables for Theme */}
      <style>{`
        :root {
          --primary-50: ${themeColors[50]};
          --primary-100: ${themeColors[100]};
          --primary-200: ${themeColors[200]};
          --primary-500: ${themeColors[500]};
          --primary-600: ${themeColors[600]};
          --primary-700: ${themeColors[700]};
        }
      `}</style>

      {/* Global Overlays */}
      <AIAssistant />

      <div className="mb-6 animate-fade-in flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white capitalize transition-colors">
            {currentTab === 'ai' ? 'AI Insights' : currentTab === 'pomodoro' ? 'Focus Timer' : currentTab.replace('-', ' ')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {currentTab === 'dashboard' && <Dashboard logs={logs} tasks={tasks} userName={profile.name} />}
      {currentTab === 'tasks' && (
        <TaskManager
          tasks={tasks}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onStartFocus={startFocusSession}
        />
      )}

      {/* Always keep PomodoroView mounted to allow timer to run in background/floating mode.
          If active tab is NOT pomodoro, we pass isMinimized=true.
      */}
      <PomodoroView
        tasks={tasks}
        initialTask={focusTask}
        isMinimized={currentTab !== 'pomodoro'}
        onMaximize={() => setCurrentTab('pomodoro')}
      />

      {currentTab === 'routine' && <RoutineLogger logs={logs} addLog={handleAddLog} />}
      {currentTab === 'ai' && <AIPlanner tasks={tasks} logs={logs} profile={profile} />}
      {currentTab === 'profile' && <ProfileView profile={profile} setProfile={setProfile} />}
      {currentTab === 'settings' && (
        <SettingsView
          darkMode={darkMode}
          toggleDarkMode={handleToggleDarkMode}
          currentTheme={theme}
          setTheme={handleSetTheme}
        />
      )}
    </Layout>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage onLogin={() => { }} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;