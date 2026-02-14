import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BentoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export function BentoCard({ title, children, className, titleClassName, contentClassName }: BentoCardProps) {
  return (
    <Card className={cn('h-full flex flex-col bg-card/70 backdrop-blur-sm border-white/10 shadow-lg rounded-xl', className)}>
      <CardHeader>
        <CardTitle className={cn("font-headline text-2xl text-primary", titleClassName)}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("flex-grow flex flex-col", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
