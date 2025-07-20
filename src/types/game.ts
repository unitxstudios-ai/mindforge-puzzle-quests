export interface Mission {
  id: number;
  title: string;
  description: string;
  levelsCompleted: number;
  totalLevels: number;
  isUnlocked: boolean;
  cognitiveSkills: CognitiveSkill[];
}

export interface Level {
  id: number;
  missionId: number;
  levelNumber: number;
  puzzleType: PuzzleType;
  difficulty: number;
  isCompleted: boolean;
  bestTime?: number;
  attempts: number;
  cognitiveSkill: CognitiveSkill;
}

export interface GameProgress {
  currentMission: number;
  currentLevel: number;
  totalXP: number;
  forgePoints: number;
  streak: number;
  lastPlayedDate?: string;
  missions: Mission[];
}

export type PuzzleType = 
  | 'memory'
  | 'logic'
  | 'pattern'
  | 'number'
  | 'reaction'
  | 'spatial'
  | 'attention'
  | 'language';

export type CognitiveSkill =
  | 'Focus'
  | 'Logic'
  | 'Memory'
  | 'Speed'
  | 'Pattern Recognition'
  | 'Spatial Reasoning'
  | 'Problem Solving'
  | 'Working Memory';

export interface PuzzleResult {
  completed: boolean;
  timeSpent: number;
  accuracy: number;
  points: number;
}

export interface Settings {
  soundEnabled: boolean;
  darkMode: boolean;
  animationsEnabled: boolean;
}