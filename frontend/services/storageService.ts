import { Task, RoutineLog, UserProfile, Priority, Category } from '../types';
import { api } from './api';

const TASKS_KEY = 'studentflow_tasks';
const LOGS_KEY = 'studentflow_logs';
const PROFILE_KEY = 'studentflow_profile';

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Helper to get data from cache or return null if expired/missing
const getFromCache = <T>(key: string): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed: CacheItem<T> = JSON.parse(cached);
    const now = Date.now();
    if (now - parsed.timestamp < CACHE_DURATION) {
      return parsed.data;
    }
  } catch (e) {
    console.error('Error parsing cache:', e);
  }
  return null;
};

// Helper to save data to cache
const saveToCache = <T>(key: string, data: T) => {
  const item: CacheItem<T> = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const storageService = {
  getTasks: async (): Promise<Task[]> => {
    // Try cache first
    const cachedTasks = getFromCache<Task[]>(TASKS_KEY);
    if (cachedTasks) {
      return cachedTasks;
    }

    // Fetch from API
    try {
      const tasks = await api.get('/tasks');
      saveToCache(TASKS_KEY, tasks);
      return tasks;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

  saveTask: async (task: Task): Promise<Task> => {
    try {
      const savedTask = await api.post('/tasks', task);

      // Update cache
      const currentTasks = getFromCache<Task[]>(TASKS_KEY) || [];
      const updatedTasks = [...currentTasks, savedTask];
      saveToCache(TASKS_KEY, updatedTasks);

      return savedTask;
    } catch (error) {
      console.error('Failed to save task:', error);
      throw error;
    }
  },

  updateTask: async (task: Task): Promise<Task> => {
    try {
      const updatedTask = await api.put(`/tasks/${task.id}`, task);

      // Update cache
      const currentTasks = getFromCache<Task[]>(TASKS_KEY) || [];
      const newTasks = currentTasks.map(t => t.id === task.id ? updatedTask : t);
      saveToCache(TASKS_KEY, newTasks);

      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);

      // Update cache
      const currentTasks = getFromCache<Task[]>(TASKS_KEY) || [];
      const newTasks = currentTasks.filter(t => t.id !== id);
      saveToCache(TASKS_KEY, newTasks);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  getLogs: async (): Promise<RoutineLog[]> => {
    const cachedLogs = getFromCache<RoutineLog[]>(LOGS_KEY);
    if (cachedLogs) {
      return cachedLogs;
    }

    try {
      const logs = await api.get('/routines/latest');
      saveToCache(LOGS_KEY, logs);
      return logs;
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      throw error;
    }
  },

  saveLog: async (log: RoutineLog): Promise<RoutineLog> => {
    try {
      const savedLog = await api.post('/routines', log);

      // Update cache - prepend new log
      const currentLogs = getFromCache<RoutineLog[]>(LOGS_KEY) || [];
      const updatedLogs = [savedLog, ...currentLogs];
      saveToCache(LOGS_KEY, updatedLogs);

      return savedLog;
    } catch (error) {
      console.error('Failed to save log:', error);
      throw error;
    }
  },

  getProfile: async (): Promise<UserProfile> => {
    const cachedProfile = getFromCache<UserProfile>(PROFILE_KEY);
    if (cachedProfile) {
      return cachedProfile;
    }

    try {
      const response = await api.get('/auth/me');
      // Map backend snake_case to frontend camelCase
      const profile: UserProfile = {
        name: response.full_name || response.name || 'Student',
        email: response.email,
        profilePicture: response.pfp_url,
        goals: typeof response.academic_goals === 'string' ? JSON.parse(response.academic_goals) : (response.academic_goals || []),
        examDates: typeof response.upcoming_exams === 'string' ? JSON.parse(response.upcoming_exams) : (response.upcoming_exams || []),
        settings: {
          darkMode: response.settings_dark_mode === 1,
          theme: response.settings_color_theme || 'teal'
        }
      };

      saveToCache(PROFILE_KEY, profile);
      return profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  saveProfile: async (profile: UserProfile): Promise<UserProfile> => {
    try {
      const updatedProfile = await api.put('/auth/profile', profile);
      saveToCache(PROFILE_KEY, updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  },

  toggleDarkMode: async (): Promise<boolean> => {
    try {
      const res = await api.patch('/settings/dark-mode', {});
      const isDark = res.dark_mode;

      // Update cache
      const profile = getFromCache<UserProfile>(PROFILE_KEY);
      if (profile && profile.settings) {
        profile.settings.darkMode = isDark;
        saveToCache(PROFILE_KEY, profile);
      }

      return isDark;
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
      throw error;
    }
  },

  changeTheme: async (theme: string): Promise<string> => {
    try {
      const res = await api.patch('/settings/theme', { theme });

      // Update cache
      const profile = getFromCache<UserProfile>(PROFILE_KEY);
      if (profile && profile.settings) {
        profile.settings.theme = theme;
        saveToCache(PROFILE_KEY, profile);
      }

      return theme;
    } catch (error) {
      console.error('Failed to change theme:', error);
      throw error;
    }
  }
};