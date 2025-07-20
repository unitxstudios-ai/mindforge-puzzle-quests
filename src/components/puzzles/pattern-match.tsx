import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PatternMatchProps {
  onComplete: (timeSpent: number) => void;
  difficulty: number;
}

const shapes = ['●', '■', '▲', '◆', '★', '♠', '♥', '♦'];
const colors = ['text-primary', 'text-secondary', 'text-accent', 'text-warning', 'text-destructive'];

interface PatternItem {
  shape: string;
  color: string;
}

export function PatternMatch({ onComplete, difficulty }: PatternMatchProps) {
  const [pattern, setPattern] = useState<PatternItem[]>([]);
  const [options, setOptions] = useState<PatternItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'ready' | 'playing' | 'complete'>('ready');
  const [startTime, setStartTime] = useState<number>(0);

  const patternLength = Math.min(3 + difficulty, 6);

  const generatePattern = () => {
    const newPattern: PatternItem[] = [];
    
    // Create a logical pattern
    for (let i = 0; i < patternLength; i++) {
      const shape = shapes[i % shapes.length];
      const color = colors[i % colors.length];
      newPattern.push({ shape, color });
    }
    
    setPattern(newPattern);
    
    // Generate options including the correct next item
    const correctNext = {
      shape: shapes[patternLength % shapes.length],
      color: colors[patternLength % colors.length]
    };
    
    const wrongOptions: PatternItem[] = [];
    while (wrongOptions.length < 3) {
      const wrongOption = {
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      if (wrongOption.shape !== correctNext.shape || wrongOption.color !== correctNext.color) {
        wrongOptions.push(wrongOption);
      }
    }
    
    const allOptions = [correctNext, ...wrongOptions];
    // Shuffle options
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setOptions(allOptions);
  };

  const startGame = () => {
    generatePattern();
    setSelectedOption(null);
    setGamePhase('playing');
    setStartTime(Date.now());
  };

  const handleOptionClick = (index: number) => {
    if (gamePhase !== 'playing') return;
    
    setSelectedOption(index);
    
    // Check if correct
    const selectedItem = options[index];
    const correctNext = {
      shape: shapes[patternLength % shapes.length],
      color: colors[patternLength % colors.length]
    };
    
    const isCorrect = selectedItem.shape === correctNext.shape && selectedItem.color === correctNext.color;
    
    setTimeout(() => {
      if (isCorrect) {
        const timeSpent = (Date.now() - startTime) / 1000;
        setGamePhase('complete');
        setTimeout(() => onComplete(timeSpent), 1000);
      } else {
        // Wrong answer, try again
        setSelectedOption(null);
        generatePattern();
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Pattern Recognition</h2>
        <p className="text-muted-foreground">
          Study the pattern and select what comes next
        </p>
      </div>

      {gamePhase !== 'ready' && (
        <>
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Pattern:</h3>
                <div className="flex justify-center items-center space-x-4">
                  {pattern.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "text-4xl font-bold transition-all duration-300",
                        item.color
                      )}
                    >
                      {item.shape}
                    </div>
                  ))}
                  <div className="text-4xl text-muted-foreground">?</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Choose the next item:</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                    className={cn(
                      "aspect-square rounded-lg border-2 transition-all duration-300",
                      "flex items-center justify-center text-3xl font-bold",
                      "hover:scale-105 active:scale-95 disabled:cursor-not-allowed",
                      selectedOption === index && "ring-2 ring-primary shadow-soft scale-110",
                      selectedOption === null && "bg-card border-border hover:border-primary/50",
                      selectedOption !== null && selectedOption !== index && "opacity-50"
                    )}
                  >
                    <span className={cn("transition-all duration-300", option.color)}>
                      {option.shape}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {gamePhase === 'ready' && (
        <Button 
          onClick={startGame}
          className="bg-gradient-primary hover:opacity-90"
          size="lg"
        >
          Start Challenge
        </Button>
      )}

      {gamePhase === 'playing' && selectedOption === null && (
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">Find the pattern!</div>
          <div className="text-sm text-muted-foreground">What comes next in the sequence?</div>
        </div>
      )}

      {gamePhase === 'complete' && (
        <div className="text-center">
          <div className="text-lg font-semibold text-success">Excellent!</div>
          <div className="text-sm text-muted-foreground">Pattern recognized!</div>
        </div>
      )}
    </div>
  );
}