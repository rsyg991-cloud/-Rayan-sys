import AcademicTasks from '@/components/features/university/AcademicTasks';
import DeadlineTracker from '@/components/features/university/DeadlineTracker';
import HabitTracker from '@/components/features/life/HabitTracker';
import PersonalTasks from '@/components/features/life/PersonalTasks';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary">
          حياتي
        </h1>
        <p className="text-muted-foreground text-lg">
          مخططك الرقمي الشخصي
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* University Zone */}
        <div className="space-y-6 lg:space-y-8">
          <h2 className="text-2xl font-bold font-headline text-center text-accent">🎓 المنطقة الجامعية</h2>
          <DeadlineTracker />
          <AcademicTasks />
        </div>
        {/* Life Zone */}
        <div className="space-y-6 lg:space-y-8">
           <h2 className="text-2xl font-bold font-headline text-center text-accent">🏠 منطقة الحياة</h2>
          <HabitTracker />
          <PersonalTasks />
        </div>
      </div>
    </main>
  );
}
