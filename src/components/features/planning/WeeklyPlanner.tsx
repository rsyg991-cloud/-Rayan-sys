"use client";
import { useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { BentoCard } from '../shared/BentoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

// Simple task type for the planner
interface PlannerTask {
  id: string;
  text: string;
}

// State will be an object with day names as keys
type WeeklyPlan = {
  [key: string]: PlannerTask[];
};

const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export default function WeeklyPlanner() {
  const [plan, setPlan] = useLocalStorage<WeeklyPlan>('weeklyPlan_v1', {
    "الأحد": [], "الإثنين": [], "الثلاثاء": [], "الأربعاء": [], "الخميس": [], "الجمعة": [], "السبت": []
  });
  const [newTask, setNewTask] = useState<{ [key: string]: string }>({});

  const handleInputChange = (day: string, value: string) => {
    setNewTask(prev => ({ ...prev, [day]: value }));
  };

  const addTask = (day: string) => {
    const text = newTask[day]?.trim();
    if (!text) return;

    const task: PlannerTask = { id: crypto.randomUUID(), text };
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

  return (
    <BentoCard title="المخطط الأسبوعي">
        <ScrollArea className="h-[340px] -mx-4">
            <Accordion type="single" collapsible className="w-full px-4" defaultValue={daysOfWeek[new Date().getDay()]}>
            {daysOfWeek.map((day) => (
                <AccordionItem value={day} key={day}>
                <AccordionTrigger>{day} ({plan[day]?.length || 0})</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2">
                        <ul className="space-y-2">
                           <AnimatePresence>
                            {plan[day] && plan[day].map(task => (
                                <motion.li 
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-2 p-2 rounded-md bg-background"
                                >
                                    <span className="flex-grow">{task.text}</span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteTask(day, task.id)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </motion.li>
                            ))}
                            </AnimatePresence>
                        </ul>
                         {plan[day]?.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">لا توجد مهام لهذا اليوم.</p>}

                        <div className="flex gap-2 pt-2">
                            <Input 
                                placeholder="مهمة جديدة..."
                                value={newTask[day] || ''}
                                onChange={(e) => handleInputChange(day, e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTask(day)}
                            />
                            <Button size="icon" onClick={() => addTask(day)}><Plus /></Button>
                        </div>
                    </div>
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </ScrollArea>
    </BentoCard>
  );
}
