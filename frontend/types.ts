export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum Category {
  STUDY = 'Study',
  HEALTH = 'Health',
  PERSONAL = 'Personal',
  WORK = 'Work',
  OTHER = 'Other'
}

export interface Task {
  id: string;
  _id?: string; // MongoDB ID
  title: string;
  durationMinutes: number;
  deadline: string; // ISO Date string
  priority: Priority;
  category: Category;
  completed: boolean;
}

export interface RoutineLog {
  id: string;
  _id?: string; // MongoDB ID
  date: string; // YYYY-MM-DD
  wakeUpTime: string; // HH:mm
  sleepTime: string; // HH:mm
  studyHours: number;
  screenTimeHours: number;
  exerciseMinutes: number;
  moodRating: number; // 1-10
}

export interface UserProfile {
  _id?: string;
  name: string;
  email?: string;
  profilePicture?: string; // Base64 string or URL
  goals: string[];
  examDates: { subject: string; date: string }[];
  settings?: {
    darkMode: boolean;
    theme: string;
  };
}

export interface AIAnalysisResult {
  id?: string;
  createdAt?: string;
  insights: string[];
  suggestedSchedule: { time: string; activity: string; note?: string }[];
  productivityScore: number;
}