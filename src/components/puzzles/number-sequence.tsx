import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumberSequenceProps {
  onComplete: (timeSpent: number) => void;
  difficulty: number;
}

export function NumberSequence({ onComplete, difficulty }: NumberSequenceProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [answer, setAnswer] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [gamePhase, setGamePhase] = useState<'ready' | 'playing' | 'complete' | 'wrong'>('ready');
  const [startTime, setStartTime] = useState<number>(0);
  const [sequenceType, setSequenceType] = useState<string>("");

  const generateSequence = () => {
    const types = ['arithmetic', 'geometric', 'fibonacci', 'squares', 'primes'];
    const type = types[Math.floor(Math.random() * types.length)];
    setSequenceType(type);
    
    let newSequence: number[] = [];
    let nextNumber = 0;

    switch (type) {
      case 'arithmetic':
        const diff = Math.floor(Math.random() * 5) + 2; // 2-6
        const start = Math.floor(Math.random() * 10) + 1;
        for (let i = 0; i < 4 + difficulty; i++) {
          newSequence.push(start + (i * diff));
        }
        nextNumber = start + (newSequence.length * diff);
        break;
        
      case 'geometric':
        const ratio = Math.floor(Math.random() * 3) + 2; // 2-4
        const initial = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < 3 + difficulty; i++) {
          newSequence.push(initial * Math.pow(ratio, i));
        }
        nextNumber = initial * Math.pow(ratio, newSequence.length);
        break;
        
      case 'fibonacci':
        newSequence = [1, 1];
        for (let i = 2; i < 4 + difficulty; i++) {
          newSequence.push(newSequence[i-1] + newSequence[i-2]);
        }
        nextNumber = newSequence[newSequence.length - 1] + newSequence[newSequence.length - 2];
        break;
        
      case 'squares':
        for (let i = 1; i <= 4 + difficulty; i++) {
          newSequence.push(i * i);
        }
        nextNumber = (newSequence.length + 1) * (newSequence.length + 1);
        break;
        
      case 'primes':
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        newSequence = primes.slice(0, 4 + difficulty);
        nextNumber = primes[newSequence.length];
        break;
    }

    setSequence(newSequence);
    setAnswer(nextNumber);
  };

  const startGame = () => {
    generateSequence();
    setUserAnswer("");
    setGamePhase('playing');
    setStartTime(Date.now());
  };

  const handleSubmit = () => {
    const userNum = parseInt(userAnswer);
    if (userNum === answer) {
      const timeSpent = (Date.now() - startTime) / 1000;
      setGamePhase('complete');
      setTimeout(() => onComplete(timeSpent), 1000);
    } else {
      setGamePhase('wrong');
      setTimeout(() => {
        setGamePhase('playing');
        setUserAnswer("");
      }, 1500);
    }
  };

  const getSequenceHint = () => {
    switch (sequenceType) {
      case 'arithmetic':
        return "Each number increases by the same amount";
      case 'geometric':
        return "Each number is multiplied by the same factor";
      case 'fibonacci':
        return "Each number is the sum of the two previous numbers";
      case 'squares':
        return "Perfect squares: 1², 2², 3², ...";
      case 'primes':
        return "Prime numbers in sequence";
      default:
        return "Find the pattern in the numbers";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Number Sequence</h2>
        <p className="text-muted-foreground">
          Find the pattern and determine the next number
        </p>
      </div>

      {gamePhase !== 'ready' && (
        <>
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sequence:</h3>
                <div className="flex justify-center items-center space-x-3 mb-4">
                  {sequence.map((num, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-lg bg-gradient-soft border flex items-center justify-center text-lg font-bold text-foreground"
                    >
                      {num}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-lg border-2 border-dashed border-primary flex items-center justify-center text-lg font-bold text-primary">
                    ?
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground italic">
                  Hint: {getSequenceHint()}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Your answer:</label>
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter the next number"
                    className="text-center text-lg font-semibold"
                    disabled={gamePhase === 'complete' || gamePhase === 'wrong'}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && userAnswer) {
                        handleSubmit();
                      }
                    }}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer || gamePhase === 'complete' || gamePhase === 'wrong'}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  Submit Answer
                </Button>
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

      {gamePhase === 'playing' && (
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">Analyze the pattern</div>
          <div className="text-sm text-muted-foreground">What number comes next?</div>
        </div>
      )}

      {gamePhase === 'wrong' && (
        <div className="text-center">
          <div className="text-lg font-semibold text-destructive">Not quite right</div>
          <div className="text-sm text-muted-foreground">Try again! The answer was {answer}</div>
        </div>
      )}

      {gamePhase === 'complete' && (
        <div className="text-center">
          <div className="text-lg font-semibold text-success">Perfect!</div>
          <div className="text-sm text-muted-foreground">You found the pattern!</div>
        </div>
      )}
    </div>
  );
}