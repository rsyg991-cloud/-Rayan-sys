"use client";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlarmClock, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { useCountdown } from '@/hooks/use-countdown';
import { Deadline, DeadlineType } from '@/lib/types';
import { BentoCard } from '../shared/BentoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, differenceInDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { EmptyState } from '../shared/EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const deadlineSchema = z.object({
  subject: z.string().min(1, 'اسم المادة مطلوب'),
  type: z.enum(['Exam', 'Assignment', 'Project', 'Other']),
  dueDate: z.date({ required_error: 'تاريخ الاستحقاق مطلوب' }),
});

type DeadlineFormData = z.infer<typeof deadlineSchema>;

const DeadlineCard = ({ deadline, onDelete }: { deadline: Deadline; onDelete: (id: string) => void }) => {
  const countdown = useCountdown(deadline.dueDate);
  const daysLeft = differenceInDays(new Date(deadline.dueDate), new Date());

  const cardColor =
    countdown.isPast ? 'bg-destructive/10 border-destructive/30' :
    daysLeft < 3 ? 'bg-red-500/10 border-red-500/30' :
    daysLeft < 7 ? 'bg-yellow-500/10 border-yellow-500/30' :
    'bg-blue-500/10 border-blue-500/30';
  
  const Icon =
    countdown.isPast ? AlarmClock :
    daysLeft < 3 ? AlertTriangle :
    daysLeft < 7 ? AlarmClock :
    ShieldCheck;
  
  const formatType = (type: DeadlineType) => {
    const types = { 'Exam': 'امتحان', 'Assignment': 'واجب', 'Project': 'مشروع', 'Other': 'آخر' };
    return types[type];
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn("p-4 rounded-lg flex items-center gap-4 transition-colors", cardColor)}
    >
      <Icon className="w-8 h-8 shrink-0" />
      <div className="flex-grow">
        <p className="font-bold text-lg">{deadline.subject}</p>
        <p className="text-sm text-muted-foreground">{formatType(deadline.type)} - {format(new Date(deadline.dueDate), 'd MMMM yyyy', { locale: ar })}</p>
        {countdown.isPast ? (
            <p className="font-bold text-destructive">انتهى الوقت!</p>
        ) : (
            <p className="font-mono font-bold text-sm tracking-wider">
                {`${countdown.days}ي ${countdown.hours}س ${countdown.minutes}د ${countdown.seconds}ث`}
            </p>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={() => onDelete(deadline.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 size={16} />
      </Button>
    </motion.div>
  );
};

export default function DeadlineTracker() {
  const [deadlines, setDeadlines] = useLocalStorage<Deadline[]>('deadlines', []);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<DeadlineFormData>({
    resolver: zodResolver(deadlineSchema),
    defaultValues: { type: 'Assignment' }
  });

  const addDeadline = (data: DeadlineFormData) => {
    const newDeadline: Deadline = {
      id: crypto.randomUUID(),
      subject: data.subject,
      type: data.type,
      dueDate: data.dueDate.toISOString(),
    };
    setDeadlines(prev => [newDeadline, ...prev].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    reset();
  };

  const deleteDeadline = (id: string) => {
    setDeadlines(deadlines.filter(d => d.id !== id));
  };

  return (
    <BentoCard title="متتبع المواعيد النهائية" contentClassName="p-0">
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit(addDeadline)} className="p-4 border-b space-y-3">
          <Input {...register('subject')} placeholder="اسم المادة" className="h-11" />
          {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          <div className="flex gap-2">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="h-11 flex-1">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exam">امتحان</SelectItem>
                    <SelectItem value="Assignment">واجب</SelectItem>
                    <SelectItem value="Project">مشروع</SelectItem>
                    <SelectItem value="Other">آخر</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("h-11 w-[200px] justify-start text-right font-normal", !field.value && "text-muted-foreground")}>
                                <AlarmClock className="ml-2 h-4 w-4" />
                                {field.value ? format(field.value, 'PPP', { locale: ar }) : <span>اختر تاريخ</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                )}
            />
          </div>
            {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
          <Button type="submit" className="w-full h-12">أضف موعد نهائي</Button>
        </form>
        <ScrollArea className="h-[300px] flex-grow">
          <div className="p-4">
            {deadlines.length === 0 ? (
              <EmptyState title="لا توجد مواعيد نهائية" description="كل شيء تحت السيطرة!" />
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {deadlines.map(d => <DeadlineCard key={d.id} deadline={d} onDelete={deleteDeadline} />)}
                </AnimatePresence>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </BentoCard>
  );
}
