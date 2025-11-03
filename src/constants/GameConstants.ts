// Game configuration constants
export const GAME_CONFIG = {
  TARGET_FPS: 60,
  FRAME_TIME: 1000 / 60, // ~16.67ms per frame

  // Apple IIe original resolution (scaled up for mobile)
  APPLE_IIE_WIDTH: 280,
  APPLE_IIE_HEIGHT: 192,

  // Mobile scaling factor
  SCALE_FACTOR: 2.5,

  // Tile sizes for retro games
  TILE_SIZE: 16,

  // Player settings
  PLAYER_SPEED: 3,
  PLAYER_JUMP_FORCE: -8,
  GRAVITY: 0.5,

  // Game states
  STATES: {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  },
};

// Control settings
export const CONTROL_CONFIG = {
  JOYSTICK_SIZE: 100,
  JOYSTICK_DEADZONE: 0.2,
  BUTTON_SIZE: 60,
  HAPTIC_ENABLED: true,
};

// Audio settings
export const AUDIO_CONFIG = {
  MASTER_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
  MUSIC_VOLUME: 0.5,
};
