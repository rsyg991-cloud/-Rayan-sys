"use client";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, Trash2, Flag } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Goal } from '@/lib/types';
import { BentoCard } from '../shared/BentoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '../shared/EmptyState';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function GoalsTracker() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim() === '') return;
    const newGoalItem: Goal = { id: crypto.randomUUID(), text: newGoal, completed: false };
    setGoals(prev => [newGoalItem, ...prev]);
    setNewGoal('');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(goal => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <BentoCard title="الأهداف" contentClassName="p-0">
      <div className="flex flex-col h-full">
        <form onSubmit={addGoal} className="flex gap-2 p-4 border-b">
          <Input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="أضف هدفًا جديدًا..."
            className="h-12 text-base"
          />
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0">
            <Plus />
          </Button>
        </form>
        <ScrollArea className="h-[250px] flex-grow">
          <div className="p-4">
            {goals.length === 0 ? (
              <EmptyState title="لا توجد أهداف" description="حدد أهدافك وابدأ في تحقيقها." />
            ) : (
              <ul className="space-y-3">
                <AnimatePresence>
                  {goals.map((goal) => (
                    <motion.li
                      key={goal.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background"
                    >
                      <Button
                        variant={goal.completed ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => toggleGoal(goal.id)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Flag size={16} />
                      </Button>
                      <motion.span layout="position" className={cn("flex-grow", goal.completed && 'line-through text-muted-foreground')}>
                        {goal.text}
                      </motion.span>
                      <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
