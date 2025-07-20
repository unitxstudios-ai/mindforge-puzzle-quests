import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CognitiveSkillBadge } from "@/components/ui/cognitive-skill-badge";
import { gameStore } from "@/store/gameStore";
import { GameProgress } from "@/types/game";
import { Play, Settings, Trophy, Flame, Zap } from "lucide-react";

export default function Home() {
  const [progress, setProgress] = useState<GameProgress>(gameStore.getProgress());
  const navigate = useNavigate();

  useEffect(() => {
    const savedProgress = gameStore.getProgress();
    setProgress(savedProgress);
  }, []);

  const currentMission = progress.missions.find(m => m.id === progress.currentMission);
  const missionProgress = currentMission ? (progress.currentLevel / currentMission.totalLevels) * 100 : 0;

  const handlePlayNext = () => {
    navigate(`/puzzle/${progress.currentMission}/${progress.currentLevel}`);
  };

  const handleViewMissions = () => {
    navigate('/missions');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MF</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MindForge
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Flame className="w-3 h-3 mr-1 text-warning" />
              {progress.streak} day streak
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSettings}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Current Mission Card */}
        <Card className="relative overflow-hidden shadow-card">
          <div className="absolute inset-0 bg-gradient-soft opacity-50" />
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {currentMission?.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Level {progress.currentLevel} of {currentMission?.totalLevels}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentMission?.cognitiveSkills.map((skill) => (
                    <CognitiveSkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </div>
              
              <ProgressRing progress={missionProgress} size={80} strokeWidth={6}>
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">
                    {Math.round(missionProgress)}%
                  </div>
                </div>
              </ProgressRing>
            </div>

            <Button 
              onClick={handlePlayNext}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Continue Training
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-foreground">{progress.totalXP}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{progress.forgePoints}</div>
              <div className="text-xs text-muted-foreground">Forge Points</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-foreground">{progress.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-6 h-6 mx-auto mb-2 text-accent flex items-center justify-center font-bold">
                {progress.currentMission}
              </div>
              <div className="text-2xl font-bold text-foreground">{progress.currentMission}</div>
              <div className="text-xs text-muted-foreground">Current Mission</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Jump into a random puzzle to warm up your brain.
              </p>
              <Button variant="outline" className="w-full">
                Random Puzzle
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Browse Missions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Explore all missions and replay completed levels.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleViewMissions}
              >
                View All Missions
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}