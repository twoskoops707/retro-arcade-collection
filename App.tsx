import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { MainMenu, GameSelection } from './src/screens/MainMenu';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HighScoresScreen } from './src/screens/HighScoresScreen';
import { LodeRunnerGame } from './src/games/LodeRunnerGame';
import { OregonTrailGame } from './src/games/OregonTrailGame';
import { CarmenSandiegoGame } from './src/games/CarmenSandiegoGame';
import { SoundManager } from './src/utils/SoundManager';
import { saveHighScore } from './src/utils/Storage';
import { UI_COLORS } from './src/constants/Colors';

type Screen =
  | 'menu'
  | 'settings'
  | 'high-scores'
  | 'lode-runner'
  | 'platformer'
  | 'oregon-trail'
  | 'carmen-sandiego';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    // Initialize sound manager
    SoundManager.initialize();
    SoundManager.loadSounds();
    SoundManager.loadMusic();

    return () => {
      SoundManager.cleanup();
    };
  }, []);

  const handleStartGame = (game: GameSelection) => {
    setCurrentLevel(1);

    switch (game) {
      case 'lode-runner':
        setCurrentScreen('lode-runner');
        SoundManager.playMusic('game1');
        break;
      case 'oregon-trail':
        setCurrentScreen('oregon-trail');
        SoundManager.playMusic('game2');
        break;
      case 'carmen-sandiego':
        setCurrentScreen('carmen-sandiego');
        SoundManager.playMusic('game1');
        break;
      case 'platformer':
        setCurrentScreen('platformer');
        SoundManager.playMusic('game2');
        break;
    }
  };

  const handleLevelComplete = (score: number) => {
    // Save high score
    saveHighScore({
      game: currentScreen as string,
      score,
      level: currentLevel,
      date: new Date().toISOString(),
    });

    // Load next level
    setCurrentLevel(prev => prev + 1);
  };

  const handleGameOver = (score: number) => {
    // Save high score
    saveHighScore({
      game: currentScreen as string,
      score,
      level: currentLevel,
      date: new Date().toISOString(),
    });

    // Return to menu
    SoundManager.stopMusic();
    setCurrentScreen('menu');
    SoundManager.playMusic('menu');
  };

  const handleBackToMenu = () => {
    SoundManager.stopMusic();
    setCurrentScreen('menu');
    SoundManager.playMusic('menu');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onSettings={() => setCurrentScreen('settings')}
            onHighScores={() => setCurrentScreen('high-scores')}
          />
        );

      case 'settings':
        return (
          <SettingsScreen onBack={() => setCurrentScreen('menu')} />
        );

      case 'high-scores':
        return (
          <HighScoresScreen onBack={() => setCurrentScreen('menu')} />
        );

      case 'lode-runner':
        return (
          <LodeRunnerGame
            levelId={currentLevel}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            onExit={handleBackToMenu}
          />
        );

      case 'oregon-trail':
        return (
          <OregonTrailGame
            onGameOver={handleGameOver}
            onExit={handleBackToMenu}
          />
        );

      case 'carmen-sandiego':
        return (
          <CarmenSandiegoGame
            onGameOver={handleGameOver}
            onExit={handleBackToMenu}
          />
        );

      case 'platformer':
        // Placeholder for platformer game
        return (
          <View style={styles.container}>
            <MainMenu
              onStartGame={handleStartGame}
              onSettings={() => setCurrentScreen('settings')}
              onHighScores={() => setCurrentScreen('high-scores')}
            />
          </View>
        );

      default:
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onSettings={() => setCurrentScreen('settings')}
            onHighScores={() => setCurrentScreen('high-scores')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BACKGROUND,
  },
});
