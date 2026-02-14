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
  streak: number;
  lastCompleted: string | null; // ISO date string
}
