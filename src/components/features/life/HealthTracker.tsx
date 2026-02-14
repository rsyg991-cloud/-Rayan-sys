"use client";

import { useState, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { HealthInfo, WeightEntry } from '@/lib/types';
import { BentoCard } from '../shared/BentoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { EmptyState } from '../shared/EmptyState';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const initialHealthInfo: HealthInfo = {
  height: 0,
  initialWeight: 0,
  targetWeight: 0,
  history: [],
};

export default function HealthTracker() {
  const [healthInfo, setHealthInfo] = useLocalStorage<HealthInfo>('healthInfo', initialHealthInfo);
  const [newWeight, setNewWeight] = useState('');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  
  const [tempHeight, setTempHeight] = useState(() => healthInfo.height > 0 ? healthInfo.height.toString() : '');
  const [tempTargetWeight, setTempTargetWeight] = useState(() => healthInfo.targetWeight > 0 ? healthInfo.targetWeight.toString() : '');

  const currentWeightEntry = useMemo(() => {
    if (healthInfo.history.length === 0) return null;
    const sortedHistory = [...healthInfo.history].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedHistory[0];
  }, [healthInfo.history]);
  
  const currentWeight = currentWeightEntry?.weight ?? healthInfo.initialWeight;

  const { bmi, bmiColor } = useMemo(() => {
    if (healthInfo.height > 0 && currentWeight > 0) {
      const heightInMeters = healthInfo.height / 100;
      const bmiValue = currentWeight / (heightInMeters * heightInMeters);
      
      let color = '';
      if (bmiValue < 18.5) {
        color = 'text-chart-4'; // Underweight - Yellow
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        color = 'text-primary'; // Normal - Greenish
      } else if (bmiValue >= 25 && bmiValue < 30) {
        color = 'text-chart-5'; // Overweight - Orange
      } else {
        color = 'text-destructive'; // Obese - Red
      }
      
      return { bmi: bmiValue.toFixed(1), bmiColor: color };
    }
    return { bmi: 'N/A', bmiColor: 'text-muted-foreground' };
  }, [currentWeight, healthInfo.height]);
  
  const progress = useMemo(() => {
      if (healthInfo.initialWeight <= 0 || healthInfo.targetWeight <= 0 || currentWeight <= 0) return 0;
      if (healthInfo.initialWeight === healthInfo.targetWeight) return currentWeight === healthInfo.targetWeight ? 100 : 0;
      
      const totalChange = healthInfo.initialWeight - healthInfo.targetWeight;
      const currentChange = healthInfo.initialWeight - currentWeight;
      
      const percentage = (currentChange / totalChange) * 100;
      
      return Math.max(0, Math.min(100, percentage));
  }, [currentWeight, healthInfo.initialWeight, healthInfo.targetWeight]);


  const addWeightEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) return;

    const todayISO = new Date().toISOString();

    setHealthInfo(prev => {
      const isFirstEntry = prev.initialWeight === 0 && prev.history.length === 0;

      const newHistory = prev.history.filter(entry => format(new Date(entry.date), 'yyyy-MM-dd') !== format(new Date(todayISO), 'yyyy-MM-dd'));
      const newEntry = { date: todayISO, weight: weightValue };
      const sortedHistory = [...newHistory, newEntry].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return { 
        ...prev, 
        history: sortedHistory, 
        initialWeight: isFirstEntry ? weightValue : prev.initialWeight 
      };
    });

    setNewWeight('');
  };

  const saveInfo = () => {
      const heightVal = parseInt(tempHeight, 10);
      const targetWeightVal = parseFloat(tempTargetWeight);

      if (isNaN(heightVal) || heightVal <= 0 || isNaN(targetWeightVal) || targetWeightVal <= 0) {
          // Maybe show an error toast? For now, just don't save.
          return;
      }

      setHealthInfo(prev => ({
          ...prev,
          height: heightVal,
          targetWeight: targetWeightVal,
      }));
      setIsEditingInfo(false);
  };
  
  const hasInitialInfo = healthInfo.height > 0 && healthInfo.targetWeight > 0;

  if (!hasInitialInfo || isEditingInfo) {
    return (
      <BentoCard title="المعلومات الصحية" contentClassName="p-4">
        <div className="space-y-4">
            <h3 className="text-center text-muted-foreground">{!hasInitialInfo ? "الرجاء إدخال معلوماتك للبدء" : "تعديل المعلومات"}</h3>
            <div>
                <label className="text-sm font-medium">الطول (سم)</label>
                <Input
                    type="number"
                    value={tempHeight}
                    onChange={(e) => setTempHeight(e.target.value)}
                    placeholder="مثال: 175"
                    className="mt-1"
                />
            </div>
            <div>
                <label className="text-sm font-medium">الوزن المستهدف (كجم)</label>
                <Input
                    type="number"
                    step="0.1"
                    value={tempTargetWeight}
                    onChange={(e) => setTempTargetWeight(e.target.value)}
                    placeholder="مثال: 70"
                    className="mt-1"
                />
            </div>
             {healthInfo.initialWeight === 0 && healthInfo.history.length === 0 && (
                <div>
                  <label className="text-sm font-medium">الوزن الحالي (كجم)</label>
                  <p className="text-xs text-muted-foreground mb-1">أول وزن تدخله سيعتبر وزن البداية.</p>
                  <form onSubmit={addWeightEntry} className="flex gap-2">
                      <Input
                          type="number"
                          step="0.1"
                          value={newWeight}
                          onChange={(e) => setNewWeight(e.target.value)}
                          placeholder="أدخل وزنك اليوم"
                      />
                       <Button type="submit">إضافة</Button>
                  </form>
                </div>
            )}
            <div className="flex gap-2 pt-2">
                {isEditingInfo && (
                     <Button variant="outline" onClick={() => setIsEditingInfo(false)} className="w-full">إلغاء</Button>
                )}
                <Button onClick={saveInfo} className="w-full">حفظ المعلومات</Button>
            </div>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard title="المعلومات الصحية" contentClassName="p-0">
        <div className="p-4 border-b">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">الوزن الحالي</p>
                    <p className="text-2xl font-bold">{currentWeight > 0 ? currentWeight.toFixed(1) : '-'}<span className="text-sm"> كجم</span></p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">الطول</p>
                    <p className="text-2xl font-bold">{healthInfo.height}<span className="text-sm"> سم</span></p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">مؤشر كتلة الجسم</p>
                    <p className={cn("text-2xl font-bold", bmiColor)}>{bmi}</p>
                </div>
            </div>
            {currentWeight > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between mb-1 text-sm">
                        <span>التقدم نحو الهدف</span>
                        <span className="font-bold">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>البداية: {healthInfo.initialWeight.toFixed(1)} كجم</span>
                        <span>الهدف: {healthInfo.targetWeight.toFixed(1)} كجم</span>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 space-y-4">
            <form onSubmit={addWeightEntry} className="flex gap-2">
                <Input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="أضف تحديثًا للوزن (كجم)..."
                />
                <Button type="submit">تحديث</Button>
            </form>

            <div className="h-[200px] w-full">
                {healthInfo.history.length > 1 ? (
                    <ChartContainer config={{
                        weight: { label: "الوزن", color: "hsl(var(--primary))" },
                    }}>
                        <LineChart accessibilityLayer data={healthInfo.history}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => format(new Date(value), 'd MMM', { locale: ar })}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                domain={['dataMin - 2', 'dataMax + 2']}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(label) => format(new Date(label), 'eeee, d MMMM', { locale: ar })}
                                        formatter={(value: any) => [`${Number(value).toFixed(1)} كجم`, "الوزن"]}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Line
                                dataKey="weight"
                                type="monotone"
                                stroke="var(--color-weight)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                ) : (
                    <EmptyState title={healthInfo.history.length === 1 ? 'أضف تحديثًا آخر' : 'لا توجد بيانات كافية'} description="أضف تحديثين للوزن على الأقل لرسم التقدم." />
                )}
            </div>
            
            <Button variant="outline" size="sm" onClick={() => setIsEditingInfo(true)} className="w-full">
                تعديل الطول والوزن المستهدف
            </Button>
        </div>
    </BentoCard>
  );
}
