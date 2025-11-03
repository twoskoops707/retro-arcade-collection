export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Animation {
  frames: SpriteFrame[];
  frameRate: number;
  loop: boolean;
}

export class SpriteManager {
  private animations: Map<string, Animation> = new Map();
  private currentAnimation: string | null = null;
  private currentFrame: number = 0;
  private frameTime: number = 0;
  private finished: boolean = false;

  addAnimation(name: string, animation: Animation) {
    this.animations.set(name, animation);
  }

  playAnimation(name: string, reset: boolean = false) {
    if (this.currentAnimation !== name || reset) {
      this.currentAnimation = name;
      this.currentFrame = 0;
      this.frameTime = 0;
      this.finished = false;
    }
  }

  update(deltaTime: number) {
    if (!this.currentAnimation || this.finished) return;

    const animation = this.animations.get(this.currentAnimation);
    if (!animation) return;

    this.frameTime += deltaTime;
    const frameDuration = 1 / animation.frameRate;

    if (this.frameTime >= frameDuration) {
      this.frameTime = 0;
      this.currentFrame++;

      if (this.currentFrame >= animation.frames.length) {
        if (animation.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = animation.frames.length - 1;
          this.finished = true;
        }
      }
    }
  }

  getCurrentFrame(): SpriteFrame | null {
    if (!this.currentAnimation) return null;

    const animation = this.animations.get(this.currentAnimation);
    if (!animation) return null;

    return animation.frames[this.currentFrame];
  }

  isFinished(): boolean {
    return this.finished;
  }

  reset() {
    this.currentFrame = 0;
    this.frameTime = 0;
    this.finished = false;
  }
}

// Procedural sprite generation for retro look
export class RetroSpriteGenerator {
  static createPixelPattern(
    width: number,
    height: number,
    pattern: number[][],
    color: string
  ): string {
    // This will generate SVG data for simple retro sprites
    // In production, this would be replaced with actual sprite sheets
    return `data:image/svg+xml,<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="${color}"/></svg>`;
  }
}
