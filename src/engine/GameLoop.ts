import { GAME_CONFIG } from '../constants/GameConstants';

export interface Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  active: boolean;
  type: string;
}

export class GameLoop {
  private isRunning: boolean = false;
  private lastFrameTime: number = 0;
  private accumulator: number = 0;
  private frameId: number | null = null;

  private updateCallback: ((deltaTime: number) => void) | null = null;
  private renderCallback: (() => void) | null = null;

  constructor(
    updateCallback: (deltaTime: number) => void,
    renderCallback: () => void
  ) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastFrameTime = Date.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    this.accumulator += deltaTime;

    // Fixed time step updates
    while (this.accumulator >= GAME_CONFIG.FRAME_TIME) {
      if (this.updateCallback) {
        this.updateCallback(GAME_CONFIG.FRAME_TIME / 1000); // Convert to seconds
      }
      this.accumulator -= GAME_CONFIG.FRAME_TIME;
    }

    // Render
    if (this.renderCallback) {
      this.renderCallback();
    }

    this.frameId = requestAnimationFrame(this.loop);
  };

  isActive(): boolean {
    return this.isRunning;
  }
}
