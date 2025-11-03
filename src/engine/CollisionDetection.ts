export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CollisionDetection {
  // AABB (Axis-Aligned Bounding Box) collision detection
  static checkAABB(a: Rectangle, b: Rectangle): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // Check collision with an array of rectangles
  static checkAgainstArray(entity: Rectangle, obstacles: Rectangle[]): Rectangle | null {
    for (const obstacle of obstacles) {
      if (this.checkAABB(entity, obstacle)) {
        return obstacle;
      }
    }
    return null;
  }

  // Get collision side
  static getCollisionSide(a: Rectangle, b: Rectangle): 'top' | 'bottom' | 'left' | 'right' | null {
    if (!this.checkAABB(a, b)) return null;

    const centerAX = a.x + a.width / 2;
    const centerAY = a.y + a.height / 2;
    const centerBX = b.x + b.width / 2;
    const centerBY = b.y + b.height / 2;

    const dx = centerAX - centerBX;
    const dy = centerAY - centerBY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY) {
      return dx > 0 ? 'left' : 'right';
    } else {
      return dy > 0 ? 'top' : 'bottom';
    }
  }

  // Check if point is inside rectangle
  static pointInRect(px: number, py: number, rect: Rectangle): boolean {
    return (
      px >= rect.x &&
      px <= rect.x + rect.width &&
      py >= rect.y &&
      py <= rect.y + rect.height
    );
  }

  // Tile-based collision detection
  static getTileAt(x: number, y: number, tileSize: number, tiles: string[][]): string | null {
    const tileX = Math.floor(x / tileSize);
    const tileY = Math.floor(y / tileSize);

    if (
      tileY >= 0 &&
      tileY < tiles.length &&
      tileX >= 0 &&
      tileX < tiles[0].length
    ) {
      return tiles[tileY][tileX];
    }
    return null;
  }

  static isSolidTile(tile: string | null): boolean {
    return tile === '#';
  }

  static isLadderTile(tile: string | null): boolean {
    return tile === '=';
  }

  static isRopeTile(tile: string | null): boolean {
    return tile === '-';
  }
}
