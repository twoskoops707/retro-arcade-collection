import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { CRTEffect } from '../components/CRTEffect';
import { UI_COLORS } from '../constants/Colors';
import { HighScore, loadHighScores } from '../utils/Storage';

interface HighScoresScreenProps {
  onBack: () => void;
}

export const HighScoresScreen: React.FC<HighScoresScreenProps> = ({ onBack }) => {
  const [scores, setScores] = useState<HighScore[]>([]);

  useEffect(() => {
    loadHighScores().then(setScores);
  }, []);

  const lodeRunnerScores = scores
    .filter(s => s.game === 'lode-runner')
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const platformerScores = scores
    .filter(s => s.game === 'platformer')
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <CRTEffect enabled={true}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>HIGH SCORES</Text>
            <View style={styles.titleBorder} />
          </View>

          {/* Lode Runner Scores */}
          <View style={styles.gameSection}>
            <Text style={styles.gameTitle}>LODE RUNNER</Text>
            <View style={styles.scoresContainer}>
              {lodeRunnerScores.length > 0 ? (
                lodeRunnerScores.map((score, index) => (
                  <View key={index} style={styles.scoreRow}>
                    <Text style={styles.rank}>{index + 1}.</Text>
                    <Text style={styles.scoreValue}>{score.score}</Text>
                    <Text style={styles.level}>LVL {score.level}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noScoresText}>NO SCORES YET</Text>
              )}
            </View>
          </View>

          {/* Platformer Scores */}
          <View style={styles.gameSection}>
            <Text style={styles.gameTitle}>PLATFORMER</Text>
            <View style={styles.scoresContainer}>
              {platformerScores.length > 0 ? (
                platformerScores.map((score, index) => (
                  <View key={index} style={styles.scoreRow}>
                    <Text style={styles.rank}>{index + 1}.</Text>
                    <Text style={styles.scoreValue}>{score.score}</Text>
                    <Text style={styles.level}>LVL {score.level}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noScoresText}>NO SCORES YET</Text>
              )}
            </View>
          </View>

          {/* Back Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>&lt; BACK TO MENU</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  titleBorder: {
    width: '60%',
    height: 2,
    backgroundColor: UI_COLORS.PRIMARY,
    marginTop: 16,
  },
  gameSection: {
    marginBottom: 40,
  },
  gameTitle: {
    fontSize: 20,
    color: UI_COLORS.SECONDARY,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoresContainer: {
    borderWidth: 2,
    borderColor: UI_COLORS.PRIMARY,
    padding: 16,
    backgroundColor: `${UI_COLORS.PRIMARY}05`,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: `${UI_COLORS.PRIMARY}20`,
  },
  rank: {
    fontSize: 16,
    color: UI_COLORS.TEXT,
    fontFamily: 'monospace',
    width: 40,
  },
  scoreValue: {
    fontSize: 16,
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    flex: 1,
  },
  level: {
    fontSize: 16,
    color: UI_COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
  },
  noScoresText: {
    fontSize: 16,
    color: UI_COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    textAlign: 'center',
    paddingVertical: 20,
  },
  footer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: UI_COLORS.SECONDARY,
    backgroundColor: `${UI_COLORS.SECONDARY}10`,
  },
  backButtonText: {
    fontSize: 18,
    color: UI_COLORS.SECONDARY,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
