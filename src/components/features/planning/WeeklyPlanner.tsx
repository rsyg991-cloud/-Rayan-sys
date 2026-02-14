"use client";
import { useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { BentoCard } from '../shared/BentoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Expanded task type for the planner to include completion status
interface PlannerTask {
  id: string;
  text: string;
  completed: boolean;
}

// State will be an object with day names as keys
type WeeklyPlan = {
  [key: string]: PlannerTask[];
};

const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const DayColumn = ({ day, tasks, newTask, onTaskChange, onAddTask, onDeleteTask, onToggleTask }: {
  day: string;
  tasks: PlannerTask[];
  newTask: string;
  onTaskChange: (value: string) => void;
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
}) => {
    
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask();
  };
    
  return (
    <div className="w-72 lg:w-80 flex-shrink-0 flex flex-col bg-background/50 dark:bg-black/10 rounded-xl p-3">
        <h3 className="font-bold text-center text-lg mb-3 pb-2 border-b text-primary">{day} <span className="text-xs text-muted-foreground">({tasks.length})</span></h3>
        
        <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
            <Input 
                placeholder="مهمة جديدة..."
                value={newTask}
                onChange={(e) => onTaskChange(e.target.value)}
                className="h-9"
            />
            <Button size="icon" type="submit" className="h-9 w-9 shrink-0"><Plus className="w-4 h-4" /></Button>
        </form>
        
        <ScrollArea className="flex-grow -mx-3">
            <div className="px-3 pb-1">
                {tasks.length > 0 ? (
                    <ul className="space-y-2">
                        <AnimatePresence>
                            {tasks.map(task => (
                                <motion.li 
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                    className="flex items-center gap-2 p-2 rounded-md bg-background"
                                >
                                    <Button
                                      variant={task.completed ? 'default' : 'outline'}
                                      size="icon"
                                      onClick={() => onToggleTask(task.id)}
                                      className="h-7 w-7 rounded-full shrink-0"
                                    >
                                      <Check size={14} />
                                    </Button>
                                    <span className={cn("flex-grow text-sm", task.completed && 'line-through text-muted-foreground')}>
                                        {task.text}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => onDeleteTask(task.id)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full pt-16">
                        <p className="text-sm text-center text-muted-foreground">لا توجد مهام لهذا اليوم.</p>
                    </div>
                )}
            </div>
        </ScrollArea>
    </div>
  );
};

export default function WeeklyPlanner() {
  const [plan, setPlan] = useLocalStorage<WeeklyPlan>('weeklyPlan_v2', {
    "الأحد": [], "الإثنين": [], "الثلاثاء": [], "الأربعاء": [], "الخميس": [], "الجمعة": [], "السبت": []
  });
  const [newTask, setNewTask] = useState<{ [key: string]: string }>({});

  const handleInputChange = (day: string, value: string) => {
    setNewTask(prev => ({ ...prev, [day]: value }));
  };

  const addTask = (day: string) => {
    const text = newTask[day]?.trim();
    if (!text) return;

    const task: PlannerTask = { id: crypto.randomUUID(), text, completed: false };
    setPlan(prevPlan => ({
      ...prevPlan,
      [day]: [...(prevPlan[day] || []), task]
    }));
    handleInputChange(day, '');
  };

  const deleteTask = (day: string, taskId: string) => {
    setPlan(prevPlan => ({
      ...prevPlan,
      [day]: prevPlan[day].filter(task => task.id !== taskId)
    }));
  };

  const toggleTask = (day: string, taskId: string) => {
    setPlan(prevPlan => ({
      ...prevPlan,
      [day]: prevPlan[day].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  return (
    <BentoCard title="المخطط الأسبوعي" contentClassName="p-0 flex-grow">
        <div className="flex gap-4 p-4 overflow-x-auto h-full">
            {daysOfWeek.map((day) => (
                <DayColumn
                    key={day}
                    day={day}
                    tasks={plan[day] || []}
                    newTask={newTask[day] || ''}
                    onTaskChange={(value) => handleInputChange(day, value)}
                    onAddTask={() => addTask(day)}
                    onDeleteTask={(taskId) => deleteTask(day, taskId)}
                    onToggleTask={(taskId) => toggleTask(day, taskId)}
                />
            ))}
        </div>
    </BentoCard>
  );
}
