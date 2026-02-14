export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type DeadlineType = 'Exam' | 'Assignment' | 'Project' | 'Other';

export interface Deadline {
  id: string;
  subject: string;
  type: DeadlineType;
  dueDate: string; // ISO string
}

export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // ISO date strings
}

export interface WeightEntry {
  date: string; // ISO string
  weight: number;
}

export interface HealthInfo {
  height: number; // in cm
  initialWeight: number; // in kg
  targetWeight: number; // in kg
  history: WeightEntry[];
}

export interface Match {
  id: string;
  opponent: string;
  competition: string;
  date: string; // ISO string
}
