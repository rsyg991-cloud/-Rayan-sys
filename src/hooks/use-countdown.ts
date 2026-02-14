"use client";
import { useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';

export const useCountdown = (targetDate: Date | string) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const date = new Date(targetDate);

    const updateCountdown = () => {
      const today = new Date();
      const daysLeft = differenceInCalendarDays(date, today);

      setCountdown({
        days: daysLeft >= 0 ? daysLeft : 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: daysLeft < 0
      });
    };
    
    updateCountdown();
    // We only care about days, so updating once a minute is sufficient
    // to catch the date change at midnight.
    const interval = setInterval(updateCountdown, 60000); 

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
};
