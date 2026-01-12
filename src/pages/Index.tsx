import { AppLayout } from "@/components/layout/AppLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickActions } from "@/components/home/QuickActions";
import { FamousPlayersCarousel } from "@/components/home/FamousPlayersCarousel";
import { PlanBanner } from "@/components/home/PlanBanner";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { profile } = useAuth();
  const currentPlan = profile?.plan || null;

  return (
    <AppLayout>
      <HeroSection />
      
      <FamousPlayersCarousel />
      
      <PlanBanner currentPlan={currentPlan} />
      
      <QuickActions />
    </AppLayout>
  );
};

export default Index;
