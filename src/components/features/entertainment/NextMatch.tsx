"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Loader2, Shield, Trophy } from 'lucide-react';
import { getNextAlHilalMatch } from '@/ai/flows/get-next-match-flow';
import type { Match } from '@/lib/types';
import { BentoCard } from '../shared/BentoCard';

// Using a well-known CDN for the logo. Add hostname to next.config.js
const AL_HILAL_LOGO = "https://ssl.gstatic.com/onebox/media/sports/logos/Th4fAVAZeCJWRcQq2jOd-w_96x96.png";

export default function NextMatch() {
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getNextAlHilalMatch();
        if (result) {
            setMatch(result);
        } else {
            setError("لم يتم العثور على المباراة القادمة.");
        }
      } catch (e) {
        console.error(e);
        setError("حدث خطأ أثناء جلب بيانات المباراة. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatch();
  }, []);

  return (
    <BentoCard title="المباراة القادمة للهلال" contentClassName="p-4">
      <div className="flex flex-col justify-center items-center min-h-[250px]">
        {isLoading && (
            <Loader2 className="animate-spin text-primary" size={48} />
        )}
        {error && (
            <div className="text-destructive text-center p-4">
                <p>عذراً!</p>
                <p>{error}</p>
            </div>
        )}
        {match && (
          <div className="flex flex-col items-center space-y-6 w-full animate-in fade-in-50">
              <div className="flex items-center justify-around w-full">
                  <div className="flex flex-col items-center space-y-2 text-center">
                      <Image src={AL_HILAL_LOGO} alt="شعار الهلال" width={80} height={80} className="object-contain" />
                      <span className="font-bold text-lg">الهلال</span>
                  </div>
                  <span className="text-4xl font-bold text-muted-foreground/80">VS</span>
                  <div className="flex flex-col items-center space-y-2 text-center">
                      {/* Using a generic shield icon for the opponent */}
                      <Shield size={70} className="text-muted-foreground/30 mb-[10px]"/>
                      <span className="font-bold text-lg">{match.opponent}</span>
                  </div>
              </div>

              <div className="w-full space-y-3 pt-4 text-center border-t border-border/50">
                   <div className="flex items-center justify-center gap-3 text-foreground">
                      <Trophy className="text-accent" size={20}/>
                      <span className="font-semibold">{match.competition}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-foreground">
                      <Calendar className="text-accent" size={20}/>
                      <span className="font-semibold">{new Date(match.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-foreground">
                      <Clock className="text-accent" size={20}/>
                      <span className="font-semibold">{new Date(match.date).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                  </div>
              </div>
          </div>
        )}
      </div>
    </BentoCard>
  );
}
