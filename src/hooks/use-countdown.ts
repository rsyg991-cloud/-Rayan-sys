"use client";
import { useEffect, useState } from 'react';
import { intervalToDuration, isPast } from 'date-fns';

export const useCountdown = (targetDate: Date | string) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    // This effect should only run on the client
    if (typeof window === 'undefined') return;

    const date = new Date(targetDate);
    if (isPast(date)) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      if(isPast(date)) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        clearInterval(interval);
        return;
      }
      const duration = intervalToDuration({ start: now, end: date });
      setCountdown({
        days: duration.days ?? 0,
        hours: duration.hours ?? 0,
        minutes: duration.minutes ?? 0,
        seconds: duration.seconds ?? 0,
        isPast: false
      });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
};
