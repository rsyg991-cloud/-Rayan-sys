"use client";
import { useMemo } from 'react';
import { isToday, isYesterday, differenceInCalendarDays, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Habit } from '@/lib/types';
import { BentoCard } from '../shared/BentoCard';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialHabits: Habit[] = [
  { id: 'gym', name: 'الذهاب إلى النادي', completedDates: [] },
  { id: 'read', name: 'قراءة كتاب', completedDates: [] },
  { id: 'meditate', name: 'التأمل', completedDates: [] },
  { id: 'code', name: 'البرمجة لمدة ساعة', completedDates: [] },
];

const HabitItem = ({ habit, onUpdate }: { habit: Habit; onUpdate: (id: string) => void }) => {
  const { streak, isCompletedToday } = useMemo(() => {
    const dates = habit.completedDates.map(d => parseISO(d)).sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    if (dates.length > 0) {
        const lastDate = dates[0];
        // A streak is "active" if it was completed today or yesterday.
        if (isToday(lastDate) || isYesterday(lastDate)) {
            currentStreak = 1;
            for (let i = 1; i < dates.length; i++) {
                if (differenceInCalendarDays(dates[i-1], dates[i]) === 1) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }
    }
    
    return {
        streak: currentStreak,
        isCompletedToday: dates.length > 0 && isToday(dates[0]),
    };
  }, [habit.completedDates]);


  const flameColor = () => {
    if (!isCompletedToday) return 'text-muted-foreground/50';
    if (streak >= 30) return 'text-red-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-yellow-500';
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
        <span className="font-bold font-mono text-lg text-primary">{streak}</span>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.button
                        whileTap={{ scale: 1.2 }}
                        onClick={() => onUpdate(habit.id)}
                        aria-label={`Complete ${habit.name}`}
                        className="p-2"
                    >
                        <Flame className={cn('h-7 w-7 transition-colors', flameColor())} />
                    </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isCompletedToday ? "أحسنت! يمكنك التراجع بالضغط مرة أخرى" : "اضغط للإكمال"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits_v2', initialHabits);

  const updateHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const today = new Date();
        const completedToday = habit.completedDates.some(dateStr => isToday(new Date(dateStr)));

        if (completedToday) {
          // UNDO: filter out today's date(s)
          const newDates = habit.completedDates.filter(dateStr => !isToday(new Date(dateStr)));
          return { ...habit, completedDates: newDates };
        } else {
          // COMPLETE: add today's date
          return { ...habit, completedDates: [...habit.completedDates, today.toISOString()] };
        }
      }
      return habit;
    }));
  };

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
