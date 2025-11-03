import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { CRTEffect } from '../components/CRTEffect';
import { COLORS, UI_COLORS } from '../constants/Colors';
import * as Haptics from 'expo-haptics';

export type GameSelection = 'lode-runner' | 'platformer' | 'oregon-trail' | 'carmen-sandiego';

interface MainMenuProps {
  onStartGame: (game: GameSelection) => void;
  onSettings: () => void;
  onHighScores: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onSettings,
  onHighScores,
}) => {
  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    callback();
  };

  return (
    <CRTEffect enabled={true}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>RETRO ARCADE</Text>
            <Text style={styles.subtitle}>8-BIT COLLECTION</Text>
            <View style={styles.titleBorder} />
          </View>

          {/* Game Selection */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handlePress(() => onStartGame('lode-runner'))}
            >
              <Text style={styles.menuButtonText}>&gt; LODE RUNNER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handlePress(() => onStartGame('oregon-trail'))}
            >
              <Text style={styles.menuButtonText}>&gt; OREGON TRAIL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handlePress(() => onStartGame('carmen-sandiego'))}
            >
              <Text style={styles.menuButtonText}>&gt; CARMEN SANDIEGO</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handlePress(onHighScores)}
            >
              <Text style={styles.menuButtonText}>&gt; HIGH SCORES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handlePress(onSettings)}
            >
              <Text style={styles.menuButtonText}>&gt; SETTINGS</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>PRESS TO START</Text>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>
      </SafeAreaView>
    </CRTEffect>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    letterSpacing: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: UI_COLORS.SECONDARY,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginTop: 8,
  },
  titleBorder: {
    width: '80%',
    height: 2,
    backgroundColor: UI_COLORS.PRIMARY,
    marginTop: 20,
  },
  menuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: UI_COLORS.PRIMARY,
    backgroundColor: `${UI_COLORS.PRIMARY}10`,
    minWidth: 250,
  },
  menuButtonText: {
    fontSize: 20,
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  divider: {
    width: 200,
    height: 2,
    backgroundColor: UI_COLORS.PRIMARY,
    marginVertical: 16,
    opacity: 0.3,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: UI_COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    opacity: 0.6,
  },
  versionText: {
    fontSize: 12,
    color: UI_COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    marginTop: 8,
    opacity: 0.4,
  },
});
