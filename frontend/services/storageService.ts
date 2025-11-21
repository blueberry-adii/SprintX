import { Task, RoutineLog, UserProfile, Priority, Category } from '../types';

const TASKS_KEY = 'studentflow_tasks';
const LOGS_KEY = 'studentflow_logs';
const PROFILE_KEY = 'studentflow_profile';

// Initial Mock Data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Calculus Midterm Prep',
    durationMinutes: 120,
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: Priority.URGENT,
    category: Category.STUDY,
    completed: false
  },
  {
    id: '2',
    title: 'Gym Session',
    durationMinutes: 60,
    deadline: new Date(Date.now() + 86400000).toISOString(),
    priority: Priority.MEDIUM,
    category: Category.HEALTH,
    completed: true
  },
  {
    id: '3',
    title: 'History Essay Draft',
    durationMinutes: 90,
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    priority: Priority.HIGH,
    category: Category.STUDY,
    completed: false
  }
];

// Generated 30 days of mock data for calendar scrolling
const initialLogs: RoutineLog[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `log-${i}`,
  date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  wakeUpTime: '07:00',
  sleepTime: '23:00',
  studyHours: Math.max(0, 4 + (Math.random() * 4 - 2)), // Random between 2 and 6
  screenTimeHours: Math.max(0, 3 + (Math.random() * 3 - 1.5)), // Random between 1.5 and 4.5
  exerciseMinutes: i % 2 === 0 ? 45 : 0,
  moodRating: Math.min(10, Math.max(1, 6 + Math.floor(Math.random() * 4 - 2)))
})).reverse();

const initialProfile: UserProfile = {
  name: 'Alex Student',
  goals: ['Achieve A in Math', 'Sleep 8 hours daily', 'Complete 2 coding projects'],
  examDates: [
    { subject: 'Calculus', date: '2024-06-15' },
    { subject: 'Physics', date: '2024-06-20' }
  ]
};

// Helper to simulate network delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  getTasks: async (): Promise<Task[]> => {
    await delay(300);
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : initialTasks;
  },

  saveTask: async (task: Task): Promise<Task> => {
    await delay(200);
    const tasks = await storageService.getTasks();
    // Handle both new creation and updates if passed differently, 
    // though saveTask usually implies creation in this context.
    // We ensure an ID exists.
    const newTask = { ...task, id: task.id || Date.now().toString() };
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    return newTask;
  },

  updateTask: async (task: Task): Promise<Task> => {
    await delay(200);
    const tasks = await storageService.getTasks();
    const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    return task;
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(200);
    const tasks = await storageService.getTasks();
    const updatedTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
  },

  getLogs: async (): Promise<RoutineLog[]> => {
    await delay(300);
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : initialLogs;
  },

  saveLog: async (log: RoutineLog): Promise<RoutineLog> => {
    await delay(200);
    const logs = await storageService.getLogs();
    const newLog = { ...log, id: log.id || Date.now().toString() };
    // Prepend to list
    const updatedLogs = [newLog, ...logs];
    localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));
    return newLog;
  },

  getProfile: async (): Promise<UserProfile> => {
    await delay(300);
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : initialProfile;
  },

  saveProfile: async (profile: UserProfile): Promise<UserProfile> => {
    await delay(200);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }
};