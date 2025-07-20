import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Onboarding } from "@/components/onboarding";
import { gameStore } from "@/store/gameStore";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen onboarding or has progress
    const progress = gameStore.getProgress();
    const settings = gameStore.getSettings();
    
    // Apply dark mode setting
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Show onboarding if no progress exists
    if (progress.totalXP === 0 && progress.currentMission === 1 && progress.currentLevel === 1) {
      setShowOnboarding(true);
    } else {
      navigate('/home');
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleOnboardingComplete = () => {
    navigate('/home');
  };

  const handleOnboardingSkip = () => {
    navigate('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return null;
};

export default Index;
