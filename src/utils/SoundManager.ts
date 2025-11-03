import { Audio } from 'expo-av';
import { AUDIO_CONFIG } from '../constants/GameConstants';

export type SoundEffect =
  | 'jump'
  | 'collect'
  | 'die'
  | 'enemy_die'
  | 'level_complete'
  | 'dig'
  | 'menu_select';

export type MusicTrack =
  | 'menu'
  | 'game1'
  | 'game2';

class SoundManagerClass {
  private sounds: Map<SoundEffect, Audio.Sound> = new Map();
  private music: Map<MusicTrack, Audio.Sound> = new Map();
  private currentMusic: Audio.Sound | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  // Load sound effects (will be implemented with actual sound files)
  async loadSounds() {
    // Placeholder - in production, load actual sound files
    // Example:
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../../assets/sounds/jump.mp3')
    // );
    // this.sounds.set('jump', sound);
  }

  // Load music tracks (will be implemented with actual music files)
  async loadMusic() {
    // Placeholder - in production, load actual music files
  }

  async playSound(effect: SoundEffect) {
    if (!this.soundEnabled) return;

    try {
      const sound = this.sounds.get(effect);
      if (sound) {
        await sound.replayAsync();
      } else {
        // Create simple beep sound as fallback
        this.createBeepSound(effect);
      }
    } catch (error) {
      console.error(`Error playing sound ${effect}:`, error);
    }
  }

  async playMusic(track: MusicTrack) {
    if (!this.musicEnabled) return;

    try {
      // Stop current music
      if (this.currentMusic) {
        await this.currentMusic.stopAsync();
      }

      const music = this.music.get(track);
      if (music) {
        await music.setIsLoopingAsync(true);
        await music.playAsync();
        this.currentMusic = music;
      }
    } catch (error) {
      console.error(`Error playing music ${track}:`, error);
    }
  }

  async stopMusic() {
    try {
      if (this.currentMusic) {
        await this.currentMusic.stopAsync();
        this.currentMusic = null;
      }
    } catch (error) {
      console.error('Error stopping music:', error);
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  // Helper to create simple beep sounds (temporary solution)
  private createBeepSound(effect: SoundEffect) {
    // This is a placeholder - in production, use actual sound files
    // For now, we'll rely on haptic feedback
    console.log(`Beep sound: ${effect}`);
  }

  async cleanup() {
    try {
      // Unload all sounds
      for (const sound of this.sounds.values()) {
        await sound.unloadAsync();
      }
      for (const music of this.music.values()) {
        await music.unloadAsync();
      }
      this.sounds.clear();
      this.music.clear();
      this.currentMusic = null;
    } catch (error) {
      console.error('Error cleaning up sounds:', error);
    }
  }
}

export const SoundManager = new SoundManagerClass();
