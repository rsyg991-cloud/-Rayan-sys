import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AcademicTasks from '@/components/features/university/AcademicTasks';
import DeadlineTracker from '@/components/features/university/DeadlineTracker';
import HabitTracker from '@/components/features/life/HabitTracker';
import PersonalTasks from '@/components/features/life/PersonalTasks';
import HealthTracker from '@/components/features/life/HealthTracker';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto pt-8">
        <Tabs defaultValue="university" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 text-lg">
            <TabsTrigger value="university">🎓 الجامعة</TabsTrigger>
            <TabsTrigger value="health">❤️ الصحة</TabsTrigger>
            <TabsTrigger value="life">🏠 الحياة الشخصية</TabsTrigger>
          </TabsList>
          <TabsContent value="university" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <DeadlineTracker />
                <AcademicTasks />
            </div>
          </TabsContent>
          <TabsContent value="health" className="mt-6">
             <div className="max-w-2xl mx-auto">
                <HealthTracker />
             </div>
          </TabsContent>
          <TabsContent value="life" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <HabitTracker />
                <PersonalTasks />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
