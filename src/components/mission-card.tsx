import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CognitiveSkillBadge } from "@/components/ui/cognitive-skill-badge";
import { Mission } from "@/types/game";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: Mission;
  isCurrent?: boolean;
  onClick?: () => void;
}

export function MissionCard({ mission, isCurrent, onClick }: MissionCardProps) {
  const progress = (mission.levelsCompleted / mission.totalLevels) * 100;
  const isCompleted = mission.levelsCompleted === mission.totalLevels;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-card group",
        !mission.isUnlocked && "opacity-50 cursor-not-allowed",
        isCurrent && "ring-2 ring-primary shadow-soft",
        isCompleted && "bg-gradient-soft"
      )}
      onClick={mission.isUnlocked ? onClick : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{mission.title}</h3>
              {isCurrent && (
                <Badge variant="secondary" className="text-xs">Current</Badge>
              )}
              {isCompleted && (
                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                  Complete
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {mission.description}
            </p>
          </div>
          
          {!mission.isUnlocked ? (
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          ) : (
            <ProgressRing progress={progress} size={48} strokeWidth={3}>
              <span className="text-xs font-medium text-foreground">
                {Math.round(progress)}%
              </span>
            </ProgressRing>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {mission.cognitiveSkills.map((skill) => (
              <CognitiveSkillBadge key={skill} skill={skill} />
            ))}
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {mission.levelsCompleted}/{mission.totalLevels}
            </div>
            <div className="text-xs text-muted-foreground">levels</div>
          </div>
        </div>

        {isCurrent && (
          <div className="absolute inset-0 bg-gradient-primary opacity-5 pointer-events-none" />
        )}
      </CardContent>
    </Card>
  );
}