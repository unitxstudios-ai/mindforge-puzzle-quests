import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MissionCard } from "@/components/mission-card";
import { gameStore } from "@/store/gameStore";
import { GameProgress } from "@/types/game";
import { ArrowLeft, Search } from "lucide-react";

export default function Missions() {
  const [progress, setProgress] = useState<GameProgress>(gameStore.getProgress());
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedProgress = gameStore.getProgress();
    setProgress(savedProgress);
  }, []);

  const filteredMissions = progress.missions.filter(mission =>
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.cognitiveSkills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleMissionClick = (missionId: number) => {
    if (missionId === progress.currentMission) {
      navigate(`/puzzle/${missionId}/${progress.currentLevel}`);
    } else {
      navigate(`/mission/${missionId}`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">All Missions</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search missions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Stats Summary */}
        <div className="mb-6 p-4 rounded-lg bg-muted/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {progress.missions.filter(m => m.isUnlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {progress.missions.filter(m => m.levelsCompleted === m.totalLevels).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {progress.missions.reduce((total, m) => total + m.levelsCompleted, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Levels Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {progress.missions.reduce((total, m) => total + m.totalLevels, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Levels</div>
            </div>
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              isCurrent={mission.id === progress.currentMission}
              onClick={() => handleMissionClick(mission.id)}
            />
          ))}
        </div>

        {filteredMissions.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No missions found matching "{searchTerm}"</p>
            <Button 
              variant="ghost" 
              onClick={() => setSearchTerm("")}
              className="mt-2"
            >
              Clear search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}