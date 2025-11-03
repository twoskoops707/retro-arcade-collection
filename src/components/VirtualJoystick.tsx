import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/Colors';
import { CONTROL_CONFIG } from '../constants/GameConstants';

export interface JoystickData {
  x: number; // -1 to 1
  y: number; // -1 to 1
  angle: number; // in radians
  distance: number; // 0 to 1
}

interface VirtualJoystickProps {
  onMove?: (data: JoystickData) => void;
  onRelease?: () => void;
  size?: number;
  color?: string;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  onRelease,
  size = CONTROL_CONFIG.JOYSTICK_SIZE,
  color = COLORS.GREEN,
}) => {
  const [active, setActive] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const radius = size / 2;
  const stickRadius = size / 4;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (e: GestureResponderEvent) => {
        setActive(true);
        if (CONTROL_CONFIG.HAPTIC_ENABLED) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },

      onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { dx, dy } = gestureState;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = radius - stickRadius;

        let finalX = dx;
        let finalY = dy;

        if (distance > maxDistance) {
          const angle = Math.atan2(dy, dx);
          finalX = Math.cos(angle) * maxDistance;
          finalY = Math.sin(angle) * maxDistance;
        }

        position.setValue({ x: finalX, y: finalY });

        // Calculate joystick data
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        const angle = Math.atan2(dy, dx);

        if (normalizedDistance > CONTROL_CONFIG.JOYSTICK_DEADZONE) {
          const joystickData: JoystickData = {
            x: finalX / maxDistance,
            y: finalY / maxDistance,
            angle,
            distance: normalizedDistance,
          };

          onMove?.(joystickData);
        } else {
          onMove?.({ x: 0, y: 0, angle: 0, distance: 0 });
        }
      },

      onPanResponderRelease: () => {
        setActive(false);
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();

        onRelease?.();
        onMove?.({ x: 0, y: 0, angle: 0, distance: 0 });
      },
    })
  ).current;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.base,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            backgroundColor: active ? `${color}20` : 'transparent',
          },
        ]}
      />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.stick,
          {
            width: stickRadius * 2,
            height: stickRadius * 2,
            borderRadius: stickRadius,
            backgroundColor: color,
            transform: position.getTranslateTransform(),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  base: {
    position: 'absolute',
    borderWidth: 2,
  },
  stick: {
    position: 'absolute',
    opacity: 0.9,
  },
});
