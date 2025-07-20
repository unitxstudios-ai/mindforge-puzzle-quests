import { GameProgress, Mission, Level, Settings, CognitiveSkill } from '@/types/game';

const STORAGE_KEYS = {
  PROGRESS: 'mindforge_progress',
  SETTINGS: 'mindforge_settings',
};

class GameStore {
  private progress: GameProgress;
  private settings: Settings;

  constructor() {
    this.progress = this.loadProgress();
    this.settings = this.loadSettings();
  }

  private loadProgress(): GameProgress {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (saved) {
      return JSON.parse(saved);
    }

    // Initialize default progress
    return {
      currentMission: 1,
      currentLevel: 1,
      totalXP: 0,
      forgePoints: 0,
      streak: 0,
      missions: this.generateMissions(),
    };
  }

  private loadSettings(): Settings {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      soundEnabled: true,
      darkMode: false,
      animationsEnabled: true,
    };
  }

  private generateMissions(): Mission[] {
    const missions: Mission[] = [];
    
    for (let i = 1; i <= 100; i++) {
      missions.push({
        id: i,
        title: `Mission ${i}`,
        description: this.getMissionDescription(i),
        levelsCompleted: 0,
        totalLevels: 100,
        isUnlocked: i === 1,
        cognitiveSkills: this.getMissionSkills(i),
      });
    }
    
    return missions;
  }

  private getMissionDescription(missionId: number): string {
    const descriptions = [
      'Master the fundamentals of cognitive training',
      'Enhance your pattern recognition abilities',
      'Develop advanced memory techniques',
      'Challenge your logical reasoning',
      'Accelerate your processing speed',
    ];
    
    return descriptions[(missionId - 1) % descriptions.length];
  }

  private getMissionSkills(missionId: number): CognitiveSkill[] {
    const skillSets: CognitiveSkill[][] = [
      ['Focus', 'Logic'],
      ['Memory', 'Pattern Recognition'],
      ['Speed', 'Working Memory'],
      ['Spatial Reasoning', 'Problem Solving'],
      ['Focus', 'Speed'],
    ];
    
    return skillSets[(missionId - 1) % skillSets.length];
  }

  getProgress(): GameProgress {
    return { ...this.progress };
  }

  getSettings(): Settings {
    return { ...this.settings };
  }

  updateProgress(updates: Partial<GameProgress>): void {
    this.progress = { ...this.progress, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(this.progress));
  }

  updateSettings(updates: Partial<Settings>): void {
    this.settings = { ...this.settings, ...updates };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
  }

  completeLevel(missionId: number, levelNumber: number, timeSpent: number): void {
    const mission = this.progress.missions.find(m => m.id === missionId);
    if (!mission) return;

    // Update mission progress
    if (levelNumber > mission.levelsCompleted) {
      mission.levelsCompleted = levelNumber;
    }

    // Update current position
    if (levelNumber === 100 && missionId < 100) {
      // Mission completed, unlock next mission
      const nextMission = this.progress.missions.find(m => m.id === missionId + 1);
      if (nextMission) {
        nextMission.isUnlocked = true;
      }
      
      this.progress.currentMission = missionId + 1;
      this.progress.currentLevel = 1;
    } else if (levelNumber < 100) {
      this.progress.currentLevel = levelNumber + 1;
    }

    // Add XP and Forge Points
    const basePoints = Math.floor(100 / timeSpent * 10) + (levelNumber * 2);
    this.progress.totalXP += basePoints;
    this.progress.forgePoints += Math.floor(basePoints / 10);

    // Update streak
    const today = new Date().toDateString();
    const lastPlayed = this.progress.lastPlayedDate;
    
    if (lastPlayed === today) {
      // Same day, maintain streak
    } else if (lastPlayed === new Date(Date.now() - 86400000).toDateString()) {
      // Yesterday, increment streak
      this.progress.streak += 1;
    } else {
      // Reset streak
      this.progress.streak = 1;
    }
    
    this.progress.lastPlayedDate = today;

    this.updateProgress(this.progress);
  }

  resetProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    this.progress = this.loadProgress();
  }
}

export const gameStore = new GameStore();