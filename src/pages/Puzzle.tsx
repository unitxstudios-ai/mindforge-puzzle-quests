import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CognitiveSkillBadge } from "@/components/ui/cognitive-skill-badge";
import { MemorySequence } from "@/components/puzzles/memory-sequence";
import { PatternMatch } from "@/components/puzzles/pattern-match";
import { NumberSequence } from "@/components/puzzles/number-sequence";
import { gameStore } from "@/store/gameStore";
import { GameProgress, PuzzleType } from "@/types/game";
import { ArrowLeft, RotateCcw, Timer, Target } from "lucide-react";

export default function Puzzle() {
  const { missionId, levelNumber } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<GameProgress>(gameStore.getProgress());
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  const mission = progress.missions.find(m => m.id === Number(missionId));
  const currentLevel = Number(levelNumber);

  useEffect(() => {
    const savedProgress = gameStore.getProgress();
    setProgress(savedProgress);
    setStartTime(Date.now());
  }, [missionId, levelNumber]);

  const handlePuzzleComplete = (timeSpent: number) => {
    if (!mission) return;

    gameStore.completeLevel(mission.id, currentLevel, timeSpent);
    setProgress(gameStore.getProgress());
    setIsCompleted(true);
  };

  const handleNext = () => {
    const updatedProgress = gameStore.getProgress();
    navigate(`/puzzle/${updatedProgress.currentMission}/${updatedProgress.currentLevel}`);
  };

  const handleRetry = () => {
    setIsCompleted(false);
    setStartTime(Date.now());
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!mission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Mission not found</h1>
          <Button onClick={handleBack}>Return Home</Button>
        </div>
      </div>
    );
  }

  // Simple puzzle type selection based on level
  const getPuzzleType = (level: number): PuzzleType => {
    const types: PuzzleType[] = ['memory', 'logic', 'pattern', 'number', 'reaction'];
    return types[(level - 1) % types.length];
  };

  const puzzleType = getPuzzleType(currentLevel);
  const difficulty = Math.floor((currentLevel - 1) / 10) + 1; // Increase difficulty every 10 levels

  const renderPuzzle = () => {
    switch (puzzleType) {
      case 'memory':
        return (
          <MemorySequence 
            onComplete={handlePuzzleComplete}
            difficulty={difficulty}
          />
        );
      case 'pattern':
        return (
          <PatternMatch 
            onComplete={handlePuzzleComplete}
            difficulty={difficulty}
          />
        );
      case 'number':
        return (
          <NumberSequence 
            onComplete={handlePuzzleComplete}
            difficulty={difficulty}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              {puzzleType.charAt(0).toUpperCase() + puzzleType.slice(1)} Puzzle
            </h3>
            <p className="text-muted-foreground mb-6">
              This puzzle type is coming soon!
            </p>
            <Button 
              onClick={() => handlePuzzleComplete(5)}
              className="bg-gradient-primary hover:opacity-90"
            >
              Complete (Demo)
            </Button>
          </div>
        );
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Level Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-lg font-semibold text-foreground">
                {mission.title} - Level {currentLevel}
              </div>
              <CognitiveSkillBadge skill={mission.cognitiveSkills[0]} />
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+{Math.floor(100 / ((Date.now() - startTime) / 1000) * 10) + (currentLevel * 2)}</div>
                <div className="text-sm text-muted-foreground">XP Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">+{Math.floor((100 / ((Date.now() - startTime) / 1000) * 10) / 10)}</div>
                <div className="text-sm text-muted-foreground">Forge Points</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleNext}
                className="w-full bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                Next Level
              </Button>
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {mission.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Level {currentLevel} of {mission.totalLevels}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Timer className="w-3 h-3 mr-1" />
              {Math.floor((Date.now() - startTime) / 1000)}s
            </Badge>
            <CognitiveSkillBadge skill={mission.cognitiveSkills[0]} />
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="max-w-2xl mx-auto">
          {renderPuzzle()}
        </div>
      </main>
    </div>
  );
}