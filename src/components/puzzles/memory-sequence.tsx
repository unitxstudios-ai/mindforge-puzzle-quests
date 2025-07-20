import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MemorySequenceProps {
  onComplete: (timeSpent: number) => void;
  difficulty: number;
}

export function MemorySequence({ onComplete, difficulty }: MemorySequenceProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gamePhase, setGamePhase] = useState<'ready' | 'showing' | 'playing' | 'complete'>('ready');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  
  const gridSize = 3; // 3x3 grid
  const sequenceLength = Math.min(3 + difficulty, 8);

  const generateSequence = () => {
    const newSequence: number[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * (gridSize * gridSize)));
    }
    setSequence(newSequence);
  };

  const startGame = () => {
    generateSequence();
    setPlayerSequence([]);
    setGamePhase('showing');
    setShowingSequence(true);
    setStartTime(Date.now());
  };

  const showSequence = async () => {
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setActiveIndex(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveIndex(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setShowingSequence(false);
    setGamePhase('playing');
  };

  useEffect(() => {
    if (gamePhase === 'showing' && sequence.length > 0) {
      showSequence();
    }
  }, [gamePhase, sequence]);

  const handleCellClick = (index: number) => {
    if (gamePhase !== 'playing' || showingSequence) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Check if the move is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Wrong move - restart
      setTimeout(() => {
        setPlayerSequence([]);
        setGamePhase('showing');
        setShowingSequence(true);
      }, 500);
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      const timeSpent = (Date.now() - startTime) / 1000;
      setGamePhase('complete');
      setTimeout(() => onComplete(timeSpent), 1000);
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      const isActive = activeIndex === i;
      const isPlayerClicked = playerSequence.includes(i);
      const isWrong = playerSequence.length > 0 && 
                     playerSequence[playerSequence.length - 1] === i &&
                     playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1];

      cells.push(
        <div
          key={i}
          className={cn(
            "aspect-square rounded-lg border-2 transition-all duration-300 cursor-pointer flex items-center justify-center text-2xl font-bold",
            "hover:scale-105 active:scale-95",
            isActive && "bg-primary border-primary text-primary-foreground shadow-soft scale-110",
            isPlayerClicked && !isActive && "bg-secondary/20 border-secondary",
            isWrong && "bg-destructive border-destructive text-destructive-foreground animate-pulse",
            !isActive && !isPlayerClicked && !isWrong && "bg-card border-border hover:border-primary/50"
          )}
          onClick={() => handleCellClick(i)}
        >
          {isPlayerClicked && playerSequence.indexOf(i) + 1}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Memory Sequence</h2>
        <p className="text-muted-foreground">
          Watch the sequence, then repeat it by clicking the cells in order
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {renderGrid()}
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Sequence length: {sequenceLength}
            </div>
            <div className="text-sm text-muted-foreground">
              Progress: {playerSequence.length} / {sequence.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {gamePhase === 'ready' && (
        <Button 
          onClick={startGame}
          className="bg-gradient-primary hover:opacity-90"
          size="lg"
        >
          Start Challenge
        </Button>
      )}

      {gamePhase === 'showing' && (
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">Watch carefully...</div>
          <div className="text-sm text-muted-foreground">Memorize the sequence</div>
        </div>
      )}

      {gamePhase === 'playing' && (
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">Your turn!</div>
          <div className="text-sm text-muted-foreground">Click the cells in the same order</div>
        </div>
      )}

      {gamePhase === 'complete' && (
        <div className="text-center">
          <div className="text-lg font-semibold text-success">Perfect!</div>
          <div className="text-sm text-muted-foreground">Well done!</div>
        </div>
      )}
    </div>
  );
}