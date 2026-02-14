import AcademicTasks from '@/components/features/university/AcademicTasks';
import DeadlineTracker from '@/components/features/university/DeadlineTracker';
import HabitTracker from '@/components/features/life/HabitTracker';
import PersonalTasks from '@/components/features/life/PersonalTasks';
import HealthTracker from '@/components/features/life/HealthTracker';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto pt-8">
        {/* University Zone */}
        <div className="space-y-6 lg:space-y-8">
          <h2 className="text-2xl font-bold font-headline text-center text-accent">🎓 المنطقة الجامعية</h2>
          <DeadlineTracker />
          <AcademicTasks />
        </div>
        {/* Life Zone */}
        <div className="space-y-6 lg:space-y-8">
           <h2 className="text-2xl font-bold font-headline text-center text-accent">🏠 منطقة الحياة</h2>
          <HealthTracker />
          <HabitTracker />
          <PersonalTasks />
        </div>
      </div>
    </main>
  );
}
