import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Brain, Target, Zap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const onboardingSteps = [
  {
    icon: Brain,
    title: "Welcome to MindForge",
    description: "Train your brain with scientifically designed puzzles across 100 challenging missions.",
    color: "text-primary"
  },
  {
    icon: Target,
    title: "100 Missions Await",
    description: "Each mission contains 100 unique levels targeting different cognitive skills like memory, logic, and focus.",
    color: "text-secondary"
  },
  {
    icon: Zap,
    title: "Build Your Streak",
    description: "Play daily to build your streak and earn Forge Points. Consistency is key to cognitive improvement.",
    color: "text-accent"
  },
  {
    icon: Users,
    title: "Track Your Progress",
    description: "Monitor your improvement across different cognitive skills and unlock new challenges as you advance.",
    color: "text-warning"
  }
];

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden shadow-floating">
          <CardContent className="p-8 text-center">
            {/* Skip button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>

            {/* Icon */}
            <div className={cn(
              "w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center",
              "bg-gradient-soft"
            )}>
              <Icon className={cn("w-8 h-8", step.color)} />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {step.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {step.description}
            </p>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 mb-8">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "bg-primary w-6"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Next button */}
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {currentStep < onboardingSteps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "Start Training"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}