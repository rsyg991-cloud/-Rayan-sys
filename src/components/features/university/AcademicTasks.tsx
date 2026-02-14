"use client";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, Trash2 } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Task } from '@/lib/types';
import { BentoCard } from '../shared/BentoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '../shared/EmptyState';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AcademicTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('academicTasks', []);
  const [newTask, setNewTask] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const newTaskItem: Task = { id: crypto.randomUUID(), text: newTask, completed: false };
    setTasks(prev => [newTaskItem, ...prev]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <BentoCard title="المهام الدراسية" contentClassName="p-0">
      <div className="flex flex-col h-full">
        <form onSubmit={addTask} className="flex gap-2 p-4 border-b">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="أضف مهمة دراسية جديدة..."
            className="h-12 text-base"
          />
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0">
            <Plus />
          </Button>
        </form>
        <ScrollArea className="h-[250px] flex-grow">
          <div className="p-4">
            {tasks.length === 0 ? (
              <EmptyState title="لا توجد مهام" description="أنت على ما يرام، استمتع بيومك!" />
            ) : (
              <ul className="space-y-3">
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.li
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background"
                    >
                      <Button
                        variant={task.completed ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => toggleTask(task.id)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Check size={16} />
                      </Button>
                      <motion.span layout="position" className={cn("flex-grow", task.completed && 'line-through text-muted-foreground')}>
                        {task.text}
                      </motion.span>
                      <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </ScrollArea>
      </div>
    </BentoCard>
  );
}
