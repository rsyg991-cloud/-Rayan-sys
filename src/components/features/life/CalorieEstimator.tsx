"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2, BrainCircuit } from 'lucide-react';
import { BentoCard } from '../shared/BentoCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { estimateCalories } from '@/ai/flows/estimate-calories-flow';
import { Card, CardContent } from '@/components/ui/card';

export default function CalorieEstimator() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [calorieResult, setCalorieResult] = useState<{ description: string; calories: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setCalorieResult(null);

      if (!file.type.startsWith('image/')) {
          setError("الرجاء اختيار ملف صورة صالح.");
          setPreviewUrl(null);
          return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
          setError("حجم الصورة كبير جداً. الحد الأقصى 10 ميجابايت.");
          setPreviewUrl(null);
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEstimateCalories = async () => {
    if (!previewUrl) return;

    setIsLoading(true);
    setError(null);
    setCalorieResult(null);

    try {
      const result = await estimateCalories({ photoDataUri: previewUrl });
      setCalorieResult(result);
    } catch (e) {
      console.error(e);
      setError("حدث خطأ أثناء تقدير السعرات الحرارية. قد تكون الصورة غير واضحة أو الخدمة مشغولة. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BentoCard title="تقدير السعرات الحرارية بالذكاء الاصطناعي" contentClassName="p-4">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          ارفع صورة لوجبتك وسيقوم الذكاء الاصطناعي بتقدير السعرات الحرارية لك.
        </p>

        <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2 min-h-[150px]">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="معاينة الوجبة"
                width={400}
                height={200}
                className="w-full h-auto max-h-48 object-contain rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                <Camera className="w-12 h-12" />
                <span className="font-medium">اضغط لاختيار صورة</span>
              </div>
            )}
          </label>
        </div>
        
        {previewUrl && (
          <Button onClick={handleEstimateCalories} disabled={isLoading} className="w-full h-12 text-base">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <BrainCircuit className="me-2"/>
                تقدير السعرات
              </>
            )}
            
          </Button>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {calorieResult && (
            <Card className="bg-primary/10 border-primary/30 animate-in fade-in-50">
                <CardContent className="p-4 text-center space-y-2">
                    <p className="text-muted-foreground">{calorieResult.description}</p>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold text-primary">{calorieResult.calories}</span>
                        <span className="text-lg text-muted-foreground">سعرة حرارية</span>
                    </div>
                    <p className="text-xs text-muted-foreground/80">(تقدير تقريبي)</p>
                </CardContent>
            </Card>
        )}
      </div>
    </BentoCard>
  );
}
