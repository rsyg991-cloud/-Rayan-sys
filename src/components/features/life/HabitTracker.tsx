"use client";
import { isToday, isYesterday } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Fire } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Habit } from '@/lib/types';
import { BentoCard } from '../shared/BentoCard';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialHabits: Habit[] = [
  { id: 'gym', name: 'الذهاب إلى النادي', streak: 0, lastCompleted: null },
  { id: 'read', name: 'قراءة كتاب', streak: 0, lastCompleted: null },
  { id: 'meditate', name: 'التأمل', streak: 0, lastCompleted: null },
  { id: 'code', name: 'البرمجة لمدة ساعة', streak: 0, lastCompleted: null },
];

const HabitItem = ({ habit, onUpdate }: { habit: Habit; onUpdate: (id: string) => void }) => {
  const isCompletedToday = habit.lastCompleted ? isToday(new Date(habit.lastCompleted)) : false;

  const flameColor = () => {
    if (!isCompletedToday) return 'text-muted-foreground/50';
    if (habit.streak >= 30) return 'text-red-500';
    if (habit.streak >= 14) return 'text-orange-500';
    if (habit.streak >= 7) return 'text-yellow-500';
    return 'text-accent';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-between p-3 rounded-lg bg-background"
    >
      <span className="font-medium">{habit.name}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold font-mono text-lg text-primary">{habit.streak}</span>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.button
                        whileTap={{ scale: 1.2 }}
                        onClick={() => onUpdate(habit.id)}
                        aria-label={`Complete ${habit.name}`}
                        className="p-2"
                    >
                        <Fire className={cn('h-7 w-7 transition-colors', flameColor())} />
                    </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isCompletedToday ? "أحسنت! مكتمل لليوم" : "اضغط للإكمال"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', initialHabits);

  const updateHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const today = new Date();
        const lastCompletedDate = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
        
        if (lastCompletedDate && isToday(lastCompletedDate)) {
          // If already completed today, do nothing (or maybe undo?)
          // For now, we do nothing to prevent accidental streak loss
          return habit;
        }

        const newStreak = (lastCompletedDate && isYesterday(lastCompletedDate)) ? habit.streak + 1 : 1;
        
        return { ...habit, streak: newStreak, lastCompleted: today.toISOString() };
      }
      return habit;
    }));
  };

  // Check for streak resets on component load
  // This is a simplified check. A more robust solution might use a daily check logic.
  // For now, we assume user interacts daily.
  // If a habit was not completed yesterday, its streak should be 0 if not completed today either.

  return (
    <BentoCard title="متتبع العادات" contentClassName="p-0">
        <ScrollArea className="h-[340px]">
            <div className="p-4">
                <ul className="space-y-3">
                <AnimatePresence>
                    {habits.map(habit => <HabitItem key={habit.id} habit={habit} onUpdate={updateHabit} />)}
                </AnimatePresence>
                </ul>
            </div>
        </ScrollArea>
    </BentoCard>
  );
}
