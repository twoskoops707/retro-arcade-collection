import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/Colors';
import { CONTROL_CONFIG } from '../constants/GameConstants';

export type ActionButtonType = 'A' | 'B';

interface ActionButtonsProps {
  onPressA?: () => void;
  onPressB?: () => void;
  onReleaseA?: () => void;
  onReleaseB?: () => void;
  buttonSize?: number;
  color?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPressA,
  onPressB,
  onReleaseA,
  onReleaseB,
  buttonSize = CONTROL_CONFIG.BUTTON_SIZE,
  color = COLORS.ORANGE,
}) => {
  const [buttonAPressed, setButtonAPressed] = useState(false);
  const [buttonBPressed, setButtonBPressed] = useState(false);

  const handlePressInA = () => {
    setButtonAPressed(true);
    if (CONTROL_CONFIG.HAPTIC_ENABLED) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPressA?.();
  };

  const handlePressOutA = () => {
    setButtonAPressed(false);
    onReleaseA?.();
  };

  const handlePressInB = () => {
    setButtonBPressed(true);
    if (CONTROL_CONFIG.HAPTIC_ENABLED) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPressB?.();
  };

  const handlePressOutB = () => {
    setButtonBPressed(false);
    onReleaseB?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={handlePressInB}
        onPressOut={handlePressOutB}
        activeOpacity={1}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            borderColor: color,
            backgroundColor: buttonBPressed ? `${color}60` : `${color}20`,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color }]}>B</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPressIn={handlePressInA}
        onPressOut={handlePressOutA}
        activeOpacity={1}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            borderColor: color,
            backgroundColor: buttonAPressed ? `${color}60` : `${color}20`,
            marginLeft: 16,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color }]}>A</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
