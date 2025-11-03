import { GAME_CONFIG } from '../constants/GameConstants';

export interface PhysicsBody {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  grounded: boolean;
}

export class Physics {
  static applyGravity(body: PhysicsBody, deltaTime: number) {
    if (!body.grounded) {
      body.vy += GAME_CONFIG.GRAVITY;
    }
  }

  static updatePosition(body: PhysicsBody, deltaTime: number) {
    body.x += body.vx;
    body.y += body.vy;
  }

  static clampVelocity(body: PhysicsBody, maxVx: number = 10, maxVy: number = 15) {
    body.vx = Math.max(-maxVx, Math.min(maxVx, body.vx));
    body.vy = Math.max(-maxVy, Math.min(maxVy, body.vy));
  }

  static applyFriction(body: PhysicsBody, friction: number = 0.8) {
    if (body.grounded) {
      body.vx *= friction;
    }
  }
}
