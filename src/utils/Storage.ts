import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  joystickSize: number;
  crtEffectEnabled: boolean;
}

export interface HighScore {
  game: string;
  score: number;
  level: number;
  date: string;
}

export interface GameProgress {
  currentLevel: number;
  unlockedLevels: number[];
  totalScore: number;
}

const KEYS = {
  SETTINGS: '@retro_arcade_settings',
  HIGH_SCORES: '@retro_arcade_high_scores',
  GAME_PROGRESS: '@retro_arcade_progress',
};

// Settings management
export const saveSettings = async (settings: GameSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<GameSettings> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }

  // Default settings
  return {
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
    joystickSize: 100,
    crtEffectEnabled: true,
  };
};

// High scores management
export const saveHighScore = async (highScore: HighScore): Promise<void> => {
  try {
    const scores = await loadHighScores();
    scores.push(highScore);

    // Keep only top 10 scores per game
    const gameScores = scores.filter(s => s.game === highScore.game);
    const otherScores = scores.filter(s => s.game !== highScore.game);
    const topScores = gameScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const allScores = [...otherScores, ...topScores];
    await AsyncStorage.setItem(KEYS.HIGH_SCORES, JSON.stringify(allScores));
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

export const loadHighScores = async (): Promise<HighScore[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.HIGH_SCORES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading high scores:', error);
  }
  return [];
};

export const getTopScoresForGame = async (game: string, limit: number = 10): Promise<HighScore[]> => {
  const scores = await loadHighScores();
  return scores
    .filter(s => s.game === game)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Game progress management
export const saveGameProgress = async (game: string, progress: GameProgress): Promise<void> => {
  try {
    const allProgress = await loadAllGameProgress();
    allProgress[game] = progress;
    await AsyncStorage.setItem(KEYS.GAME_PROGRESS, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
};

export const loadGameProgress = async (game: string): Promise<GameProgress> => {
  try {
    const allProgress = await loadAllGameProgress();
    if (allProgress[game]) {
      return allProgress[game];
    }
  } catch (error) {
    console.error('Error loading game progress:', error);
  }

  // Default progress
  return {
    currentLevel: 1,
    unlockedLevels: [1],
    totalScore: 0,
  };
};

const loadAllGameProgress = async (): Promise<Record<string, GameProgress>> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.GAME_PROGRESS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading all game progress:', error);
  }
  return {};
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.SETTINGS,
      KEYS.HIGH_SCORES,
      KEYS.GAME_PROGRESS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
