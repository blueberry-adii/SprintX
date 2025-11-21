export interface UserRow {
  id: number;
  uid: string;
  full_name?: string | null;
  pfp_url?: string | null;
  academic_goals?: string[];
  upcoming_exams?: { title: string; datetime: string }[];
  recommendations?: AIInsight[];
  settings_dark_mode: 0 | 1;
  settings_color_theme: "Ocean" | "Royal" | "Sky" | "Sunset";
  created_at: string;
  updated_at: string;
}

export interface TaskRow {
  id: number;
  uid: string;
  title: string;
  deadline?: string | null;
  duration_mins: number;
  priority: "Low" | "Medium" | "High" | "Urgent";
  category: "Study" | "Health" | "Personal" | "Work" | "Other";
  status: "Pending" | "Completed";
  created_at: string;
  updated_at: string;
}

export interface RoutineLogRow {
  id: number;
  uid: string;
  log_date: string;

  felt_today: "Terrible" | "Bad" | "Okay" | "Good" | "Great";

  study_hours: number;
  screen_hours: number;
  exercise_mins: number;

  wake_up_time?: string;
  sleep_time?: string;

  wellbeing_score?: number;

  created_at: string;
  updated_at: string;
}

export interface AIInsight {
  insights: string[];
  suggestedSchedule: {
    time: string;
    activity: string;
    note?: string;
  }[];
  productivityScore: number;
}
