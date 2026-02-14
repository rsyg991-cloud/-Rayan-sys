"use client";

import { useState, useEffect } from 'react';

export default function DateTimeWidget() {
  const [time, setTime] = useState('');
  const [hijriDate, setHijriDate] = useState('');

  useEffect(() => {
    const updateDates = () => {
      const now = new Date();
      
      // Time with English numerals and no seconds
      setTime(new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(now));

      // Hijri Date with English numerals
      setHijriDate(new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        numberingSystem: 'latn',
      }).format(now));
    };

    updateDates(); // Initial call
    const timerId = setInterval(updateDates, 1000); // Update every second to keep time live

    return () => clearInterval(timerId); // Cleanup on unmount
  }, []);

  return (
    <div className="bg-card/70 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl p-6 mb-8 text-center">
      <div className="flex flex-col sm:flex-row justify-evenly items-center gap-4">
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
