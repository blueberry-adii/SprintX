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
  title: string;
  durationMinutes: number;
  deadline: string; // ISO Date string
  priority: Priority;
  category: Category;
  completed: boolean;
}

export interface RoutineLog {
  id: string;
  date: string; // YYYY-MM-DD
  wakeUpTime: string; // HH:mm
  sleepTime: string; // HH:mm
  studyHours: number;
  screenTimeHours: number;
  exerciseMinutes: number;
  moodRating: number; // 1-10
}

export interface UserProfile {
  name: string;
  goals: string[];
  examDates: { subject: string; date: string }[];
}

export interface AISuggestion {
  type: 'alert' | 'schedule' | 'insight';
  message: string;
  actionable?: boolean;
}

export interface AIAnalysisResult {
  insights: string[];
  suggestedSchedule: { time: string; activity: string; note?: string }[];
  productivityScore: number;
}
