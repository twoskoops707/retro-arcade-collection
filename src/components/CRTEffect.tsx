import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/Colors';

interface CRTEffectProps {
  enabled?: boolean;
  children: React.ReactNode;
}

export const CRTEffect: React.FC<CRTEffectProps> = ({ enabled = true, children }) => {
  if (!enabled) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      {children}
      {/* Scanlines effect */}
      <View style={styles.scanlinesContainer} pointerEvents="none">
        {Array.from({ length: 100 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.scanline,
              {
                top: `${index}%`,
              },
            ]}
          />
        ))}
      </View>

      {/* Vignette effect */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.vignette}
        pointerEvents="none"
      />

      {/* Green tint overlay for authentic CRT look */}
      <View style={styles.greenTint} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  scanlinesContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.BLACK,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  greenTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.GREEN,
    opacity: 0.02,
  },
});
