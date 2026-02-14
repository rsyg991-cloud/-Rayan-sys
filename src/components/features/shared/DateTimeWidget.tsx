"use client";

import { useState, useEffect } from 'react';

export default function DateTimeWidget() {
  const [time, setTime] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');

  useEffect(() => {
    const updateDates = () => {
      const now = new Date();
      
      // Time
      setTime(new Intl.DateTimeFormat('ar-SA', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      }).format(now));

      // Gregorian Date
      setGregorianDate(new Intl.DateTimeFormat('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(now));

      // Hijri Date
      setHijriDate(new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now));
    };

    updateDates(); // Initial call
    const timerId = setInterval(updateDates, 1000); // Update every second

    return () => clearInterval(timerId); // Cleanup on unmount
  }, []);

  return (
    <div className="bg-card/70 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl p-6 mb-8 text-center">
      <div className="flex flex-col sm:flex-row justify-around items-center gap-4">
        <div className="text-primary">
          <p className="text-lg font-semibold">التاريخ الميلادي</p>
          <p className="text-xl font-bold">{gregorianDate || '...'}</p>
        </div>
        <div className="text-accent">
          <p className="text-3xl sm:text-5xl font-bold font-mono">{time || '...'}</p>
        </div>
        <div className="text-primary">
          <p className="text-lg font-semibold">التاريخ الهجري</p>
          <p className="text-xl font-bold">{hijriDate || '...'}</p>
        </div>
      </div>
    </div>
  );
}
