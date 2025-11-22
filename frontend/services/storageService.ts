import { Task, RoutineLog, UserProfile, Priority, Category, DashboardStats } from '../types';
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
      // Backend returns { msg: "...", tasks: [...] }
      const tasksData = response.tasks || response.data;

      if (!Array.isArray(tasksData)) {
        console.error("Invalid tasks format received from API", response);
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

  toggleTask: async (id: string, isCompleted: boolean): Promise<Task> => {
    try {
      const endpoint = isCompleted ? `/tasks/${id}/complete` : `/tasks/${id}/uncomplete`;
      const response = await api.patch(endpoint, {});
      const updatedTask = mapTask(response.data);

      // Update cache
      const currentTasks = getFromCache<Task[]>(TASKS_KEY) || [];
      const newTasks = currentTasks.map(t => t.id === id ? updatedTask : t);
      saveToCache(TASKS_KEY, newTasks);

      return updatedTask;
    } catch (error) {
      console.error('Failed to toggle task:', error);
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
      const logsData = response.data;

      if (!Array.isArray(logsData)) {
        console.error("Invalid logs format received from API", logsData);
        return [];
      }

      const moodMapReverse: Record<string, number> = {
        'Terrible': 2,
        'Bad': 4,
        'Okay': 6,
        'Good': 8,
        'Great': 10
      };

      const logs: RoutineLog[] = logsData.map((log: any) => ({
        id: log.id?.toString() || '',
        date: log.log_date,
        wakeUpTime: log.wake_up_time,
        sleepTime: log.sleep_time,
        studyHours: Number(log.study_hours) || 0,
        screenTimeHours: Number(log.screen_hours) || 0,
        exerciseMinutes: Number(log.exercise_mins) || 0,
        moodRating: typeof log.felt_today === 'string' ? (moodMapReverse[log.felt_today] || 6) : (log.felt_today || 6)
      }));

      saveToCache(LOGS_KEY, logs);
      return logs;
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      throw error;
    }
  },

  saveLog: async (log: RoutineLog): Promise<RoutineLog> => {
    try {
      const moodMap: Record<number, string> = {
        2: 'Terrible',
        4: 'Bad',
        6: 'Okay',
        8: 'Good',
        10: 'Great'
      };

      const backendLog = {
        log_date: log.date,
        felt_today: moodMap[log.moodRating] || 'Okay',
        study_hours: log.studyHours,
        screen_hours: log.screenTimeHours,
        exercise_mins: log.exerciseMinutes,
        wake_up_time: log.wakeUpTime,
        sleep_time: log.sleepTime
      };

      const response = await api.post('/routines', backendLog);
      const savedLog = { ...log };

      // Update cache - prepend new log
      const currentLogs = getFromCache<RoutineLog[]>(LOGS_KEY) || [];
      const filteredLogs = currentLogs.filter(l => l.date !== log.date);
      const updatedLogs = [savedLog, ...filteredLogs];
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
        // Load PFP from local storage as requested (frontend-only persistence)
        profilePicture: localStorage.getItem('studentflow_user_pfp') || data.pfp_url || '',
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
      // Save PFP to local storage
      if (profile.profilePicture) {
        localStorage.setItem('studentflow_user_pfp', profile.profilePicture);
      }

      // Map frontend camelCase to backend snake_case
      const backendProfile = {
        full_name: profile.name,
        academic_goals: profile.goals,
        upcoming_exams: profile.examDates,
        pfp_url: profile.profilePicture // Still sending to backend for sync if possible, but local takes precedence
        // settings are handled via separate endpoints
      };

      await api.put('/auth/profile', backendProfile);

      // Update cache
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
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }
};