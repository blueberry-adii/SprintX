import { Task, RoutineLog, UserProfile, Priority, Category } from '../types';
import { api } from './api';

const TASKS_KEY = 'studentflow_tasks_v3';
const LOGS_KEY = 'studentflow_logs_v3';
const PROFILE_KEY = 'studentflow_profile_v3';

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

// Helper to map backend task to frontend task
const mapTask = (data: any): Task => ({
  id: data.id,
  title: data.title,
  deadline: data.deadline,
  durationMinutes: data.duration_mins || 0,
  priority: data.priority,
  category: data.category,
  completed: data.status === 'Completed'
});

// Theme Mapping
const themeMap: Record<string, string> = {
  'teal': 'Ocean',
  'violet': 'Royal',
  'blue': 'Sky',
  'orange': 'Sunset'
};

const reverseThemeMap: Record<string, string> = {
  'Ocean': 'teal',
  'Royal': 'violet',
  'Sky': 'blue',
  'Sunset': 'orange'
};

export const storageService = {
  getTasks: async (): Promise<Task[]> => {
    // Try cache first
    const cachedTasks = getFromCache<Task[]>(TASKS_KEY);
    if (cachedTasks && Array.isArray(cachedTasks)) {
      return cachedTasks;
    }

    // Fetch from API
    try {
      const response = await api.get('/tasks');
      const tasksData = response.data;
      if (!Array.isArray(tasksData)) {
        console.error("Invalid tasks format received from API", tasksData);
        return [];
      }
      const tasks = tasksData.map(mapTask);
      saveToCache(TASKS_KEY, tasks);
      return tasks;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

  saveTask: async (task: Task): Promise<Task> => {
    try {
      // Map frontend task to backend format for sending
      const backendTask = {
        title: task.title,
        deadline: task.deadline,
        duration_mins: task.durationMinutes,
        priority: task.priority,
        category: task.category,
        status: task.completed ? 'Completed' : 'Pending'
      };

      const response = await api.post('/tasks', backendTask);
      const savedTask = mapTask(response.data);

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
      const backendTask = {
        title: task.title,
        deadline: task.deadline,
        duration_mins: task.durationMinutes,
        priority: task.priority,
        category: task.category,
        status: task.completed ? 'Completed' : 'Pending'
      };

      const response = await api.put(`/tasks/${task.id}`, backendTask);
      const updatedTask = mapTask(response.data);

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
    if (cachedLogs && Array.isArray(cachedLogs)) {
      return cachedLogs;
    }

    try {
      const response = await api.get('/routines/latest');
      const logs = response.data;
      if (!Array.isArray(logs)) {
        console.error("Invalid logs format received from API", logs);
        return [];
      }
      saveToCache(LOGS_KEY, logs);
      return logs;
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      throw error;
    }
  },

  saveLog: async (log: RoutineLog): Promise<RoutineLog> => {
    try {
      const response = await api.post('/routines', log);
      const savedLog = response.data;

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
      const data = response.data;
      // Map backend snake_case to frontend camelCase
      const profile: UserProfile = {
        name: data.full_name || data.name || 'Student',
        email: data.email,
        profilePicture: data.pfp_url,
        goals: typeof data.academic_goals === 'string' ? JSON.parse(data.academic_goals) : (data.academic_goals || []),
        examDates: typeof data.upcoming_exams === 'string' ? JSON.parse(data.upcoming_exams) : (data.upcoming_exams || []),
        settings: {
          darkMode: data.settings_dark_mode === 1,
          theme: reverseThemeMap[data.settings_color_theme] || 'teal'
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
      // Create a copy of profile to avoid mutating the original
      const profileToSend = { ...profile };
      // Remove settings from the payload if the backend doesn't support updating them via this endpoint
      const { settings, ...rest } = profileToSend as any;

      const response = await api.put('/auth/profile', rest);
      // The response might not contain the full profile, so we merge with local state or just return what we sent
      // But to be safe and keep cache consistent:
      const updatedProfile = { ...profile };
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
      const isDark = res.data.dark_mode;

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
      const backendTheme = themeMap[theme] || 'Ocean';
      const res = await api.patch('/settings/theme', { theme: backendTheme });

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