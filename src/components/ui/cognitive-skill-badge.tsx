import { Badge } from "@/components/ui/badge";
import { CognitiveSkill } from "@/types/game";
import { cn } from "@/lib/utils";

interface CognitiveSkillBadgeProps {
  skill: CognitiveSkill;
  className?: string;
}

const skillColors: Record<CognitiveSkill, string> = {
  'Focus': 'bg-primary/10 text-primary border-primary/20',
  'Logic': 'bg-secondary/10 text-secondary border-secondary/20',
  'Memory': 'bg-accent/10 text-accent border-accent/20',
  'Speed': 'bg-warning/10 text-warning border-warning/20',
  'Pattern Recognition': 'bg-primary-soft/20 text-primary border-primary/30',
  'Spatial Reasoning': 'bg-secondary-soft/20 text-secondary border-secondary/30',
  'Problem Solving': 'bg-accent/15 text-accent border-accent/25',
  'Working Memory': 'bg-muted text-muted-foreground border-border',
};

const skillIcons: Record<CognitiveSkill, string> = {
  'Focus': '🎯',
  'Logic': '🧩',
  'Memory': '🧠',
  'Speed': '⚡',
  'Pattern Recognition': '🔍',
  'Spatial Reasoning': '📐',
  'Problem Solving': '💡',
  'Working Memory': '📚',
};

export function CognitiveSkillBadge({ skill, className }: CognitiveSkillBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-xs font-medium border transition-all duration-200",
        skillColors[skill],
        className
      )}
    >
      <span className="mr-1">{skillIcons[skill]}</span>
      {skill}
    </Badge>
  );
}