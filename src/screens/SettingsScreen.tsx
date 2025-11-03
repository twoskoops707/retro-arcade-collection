import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import { CRTEffect } from '../components/CRTEffect';
import { COLORS, UI_COLORS } from '../constants/Colors';
import { GameSettings, loadSettings, saveSettings } from '../utils/Storage';
import * as Haptics from 'expo-haptics';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
    joystickSize: 100,
    crtEffectEnabled: true,
  });

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const updateSetting = async <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);

    if (settings.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <CRTEffect enabled={settings.crtEffectEnabled}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>SETTINGS</Text>
            <View style={styles.titleBorder} />
          </View>

          {/* Settings Options */}
          <View style={styles.settingsContainer}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>SOUND EFFECTS</Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={v => updateSetting('soundEnabled', v)}
                trackColor={{ false: COLORS.BLACK, true: COLORS.GREEN }}
                thumbColor={settings.soundEnabled ? COLORS.WHITE : COLORS.GREEN}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>MUSIC</Text>
              <Switch
                value={settings.musicEnabled}
                onValueChange={v => updateSetting('musicEnabled', v)}
                trackColor={{ false: COLORS.BLACK, true: COLORS.GREEN }}
                thumbColor={settings.musicEnabled ? COLORS.WHITE : COLORS.GREEN}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>HAPTIC FEEDBACK</Text>
              <Switch
                value={settings.hapticEnabled}
                onValueChange={v => updateSetting('hapticEnabled', v)}
                trackColor={{ false: COLORS.BLACK, true: COLORS.GREEN }}
                thumbColor={settings.hapticEnabled ? COLORS.WHITE : COLORS.GREEN}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>CRT EFFECT</Text>
              <Switch
                value={settings.crtEffectEnabled}
                onValueChange={v => updateSetting('crtEffectEnabled', v)}
                trackColor={{ false: COLORS.BLACK, true: COLORS.GREEN }}
                thumbColor={settings.crtEffectEnabled ? COLORS.WHITE : COLORS.GREEN}
              />
            </View>
          </View>

          {/* Back Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>&lt; BACK TO MENU</Text>
            </TouchableOpacity>
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
  settingsContainer: {
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${UI_COLORS.PRIMARY}30`,
  },
  settingLabel: {
    fontSize: 16,
    color: UI_COLORS.TEXT,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
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
