import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Circle, Text as SvgText } from 'react-native-svg';
import { VirtualJoystick, JoystickData } from '../components/VirtualJoystick';
import { ActionButtons } from '../components/ActionButtons';
import { CRTEffect } from '../components/CRTEffect';
import { COLORS } from '../constants/Colors';
import { GAME_CONFIG } from '../constants/GameConstants';
import { LevelData, parseLevelData, LODE_RUNNER_LEVELS } from '../constants/Levels';
import { GameLoop } from '../engine/GameLoop';
import { Physics, PhysicsBody } from '../engine/Physics';
import { CollisionDetection } from '../engine/CollisionDetection';
import { SoundManager } from '../utils/SoundManager';

const TILE_SIZE = 16;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Player extends PhysicsBody {
  onLadder: boolean;
  onRope: boolean;
  direction: 'left' | 'right';
}

interface Enemy extends PhysicsBody {
  direction: 'left' | 'right';
  id: number;
}

interface Gold {
  x: number;
  y: number;
  collected: boolean;
  id: number;
}

interface LodeRunnerGameProps {
  levelId?: number;
  onLevelComplete?: (score: number) => void;
  onGameOver?: (score: number) => void;
  onExit?: () => void;
}

export const LodeRunnerGame: React.FC<LodeRunnerGameProps> = ({
  levelId = 1,
  onLevelComplete,
  onGameOver,
  onExit,
}) => {
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [player, setPlayer] = useState<Player>({
    x: 48,
    y: 128,
    width: 14,
    height: 14,
    vx: 0,
    vy: 0,
    grounded: false,
    onLadder: false,
    onRope: false,
    direction: 'right',
  });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [gold, setGold] = useState<Gold[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'complete' | 'over'>('playing');

  const gameLoopRef = useRef<GameLoop | null>(null);
  const joystickDataRef = useRef<JoystickData>({ x: 0, y: 0, angle: 0, distance: 0 });

  // Initialize level
  useEffect(() => {
    const level = LODE_RUNNER_LEVELS.find(l => l.id === levelId);
    if (level) {
      const parsedLevel = parseLevelData(level);
      setCurrentLevel(parsedLevel);

      // Initialize player position
      setPlayer(prev => ({
        ...prev,
        x: parsedLevel.playerStart.x,
        y: parsedLevel.playerStart.y,
      }));

      // Initialize enemies
      setEnemies(
        parsedLevel.enemies.map((e, index) => ({
          x: e.x,
          y: e.y,
          width: 14,
          height: 14,
          vx: 1,
          vy: 0,
          grounded: false,
          direction: 'right',
          id: index,
        }))
      );

      // Initialize gold
      setGold(
        parsedLevel.gold.map((g, index) => ({
          x: g.x,
          y: g.y,
          collected: false,
          id: index,
        }))
      );
    }
  }, [levelId]);

  // Game loop
  useEffect(() => {
    if (!currentLevel || gameState !== 'playing') return;

    const updateGame = (deltaTime: number) => {
      updatePlayer(deltaTime);
      updateEnemies(deltaTime);
      checkCollisions();
    };

    const render = () => {
      // Rendering is handled by React state updates
    };

    const loop = new GameLoop(updateGame, render);
    gameLoopRef.current = loop;
    loop.start();

    return () => {
      loop.stop();
    };
  }, [currentLevel, gameState, player, enemies, gold]);

  const updatePlayer = (deltaTime: number) => {
    if (!currentLevel) return;

    setPlayer(prev => {
      const newPlayer = { ...prev };

      // Handle joystick input
      const joy = joystickDataRef.current;

      // Horizontal movement
      if (Math.abs(joy.x) > 0.3) {
        newPlayer.vx = joy.x * GAME_CONFIG.PLAYER_SPEED;
        newPlayer.direction = joy.x > 0 ? 'right' : 'left';
      } else {
        newPlayer.vx = 0;
      }

      // Check ladder/rope
      const centerX = newPlayer.x + newPlayer.width / 2;
      const centerY = newPlayer.y + newPlayer.height / 2;
      const currentTile = CollisionDetection.getTileAt(
        centerX,
        centerY,
        TILE_SIZE,
        currentLevel.tiles
      );

      newPlayer.onLadder = CollisionDetection.isLadderTile(currentTile);
      newPlayer.onRope = CollisionDetection.isRopeTile(currentTile);

      // Vertical movement
      if (newPlayer.onLadder || newPlayer.onRope) {
        if (Math.abs(joy.y) > 0.3) {
          newPlayer.vy = joy.y * GAME_CONFIG.PLAYER_SPEED;
        } else {
          newPlayer.vy = 0;
        }
      } else {
        // Apply gravity
        Physics.applyGravity(newPlayer, deltaTime);
      }

      // Update position
      const newX = newPlayer.x + newPlayer.vx;
      const newY = newPlayer.y + newPlayer.vy;

      // Collision detection with tiles
      newPlayer.grounded = false;

      // Check bottom collision
      const bottomLeft = CollisionDetection.getTileAt(
        newX,
        newY + newPlayer.height,
        TILE_SIZE,
        currentLevel.tiles
      );
      const bottomRight = CollisionDetection.getTileAt(
        newX + newPlayer.width,
        newY + newPlayer.height,
        TILE_SIZE,
        currentLevel.tiles
      );

      if (
        CollisionDetection.isSolidTile(bottomLeft) ||
        CollisionDetection.isSolidTile(bottomRight)
      ) {
        newPlayer.grounded = true;
        newPlayer.vy = 0;
        newPlayer.y = Math.floor(newPlayer.y / TILE_SIZE) * TILE_SIZE;
      } else {
        newPlayer.y = newY;
      }

      // Check horizontal collisions
      const leftTile = CollisionDetection.getTileAt(
        newX,
        newPlayer.y + newPlayer.height / 2,
        TILE_SIZE,
        currentLevel.tiles
      );
      const rightTile = CollisionDetection.getTileAt(
        newX + newPlayer.width,
        newPlayer.y + newPlayer.height / 2,
        TILE_SIZE,
        currentLevel.tiles
      );

      if (
        !CollisionDetection.isSolidTile(leftTile) &&
        !CollisionDetection.isSolidTile(rightTile)
      ) {
        newPlayer.x = newX;
      }

      // Clamp velocity
      Physics.clampVelocity(newPlayer);

      // Boundary check
      newPlayer.x = Math.max(0, Math.min(newPlayer.x, currentLevel.width * TILE_SIZE - newPlayer.width));
      newPlayer.y = Math.max(0, Math.min(newPlayer.y, currentLevel.height * TILE_SIZE - newPlayer.height));

      return newPlayer;
    });
  };

  const updateEnemies = (deltaTime: number) => {
    if (!currentLevel) return;

    setEnemies(prev =>
      prev.map(enemy => {
        const newEnemy = { ...enemy };

        // Simple AI: move horizontally and turn at walls
        newEnemy.x += newEnemy.vx;

        // Check collision with walls
        const tile = CollisionDetection.getTileAt(
          newEnemy.x + (newEnemy.vx > 0 ? newEnemy.width : 0),
          newEnemy.y + newEnemy.height / 2,
          TILE_SIZE,
          currentLevel.tiles
        );

        if (CollisionDetection.isSolidTile(tile)) {
          newEnemy.vx *= -1;
          newEnemy.direction = newEnemy.vx > 0 ? 'right' : 'left';
        }

        // Apply gravity
        Physics.applyGravity(newEnemy, deltaTime);

        // Check bottom collision
        const bottomTile = CollisionDetection.getTileAt(
          newEnemy.x + newEnemy.width / 2,
          newEnemy.y + newEnemy.height + 1,
          TILE_SIZE,
          currentLevel.tiles
        );

        if (CollisionDetection.isSolidTile(bottomTile)) {
          newEnemy.grounded = true;
          newEnemy.vy = 0;
          newEnemy.y = Math.floor(newEnemy.y / TILE_SIZE) * TILE_SIZE;
        } else {
          newEnemy.y += newEnemy.vy;
          newEnemy.grounded = false;
        }

        return newEnemy;
      })
    );
  };

  const checkCollisions = () => {
    // Check gold collection
    setGold(prev =>
      prev.map(g => {
        if (g.collected) return g;

        const collected = CollisionDetection.checkAABB(
          player,
          { x: g.x, y: g.y, width: 12, height: 12 }
        );

        if (collected) {
          setScore(s => s + 100);
          SoundManager.playSound('collect');
          return { ...g, collected: true };
        }

        return g;
      })
    );

    // Check enemy collision
    for (const enemy of enemies) {
      if (CollisionDetection.checkAABB(player, enemy)) {
        handlePlayerDeath();
        break;
      }
    }

    // Check level complete
    if (gold.every(g => g.collected)) {
      setGameState('complete');
      onLevelComplete?.(score);
    }
  };

  const handlePlayerDeath = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('over');
        onGameOver?.(score);
      } else {
        // Reset player position
        if (currentLevel) {
          setPlayer(p => ({
            ...p,
            x: currentLevel.playerStart.x,
            y: currentLevel.playerStart.y,
            vx: 0,
            vy: 0,
          }));
        }
      }
      return newLives;
    });
    SoundManager.playSound('die');
  };

  const handleJoystickMove = (data: JoystickData) => {
    joystickDataRef.current = data;
  };

  const handleJoystickRelease = () => {
    joystickDataRef.current = { x: 0, y: 0, angle: 0, distance: 0 };
  };

  const handleActionA = () => {
    // Jump (if on ground)
    if (player.grounded && !player.onLadder) {
      setPlayer(prev => ({ ...prev, vy: GAME_CONFIG.PLAYER_JUMP_FORCE }));
      SoundManager.playSound('jump');
    }
  };

  const handleActionB = () => {
    // Dig (to be implemented)
    SoundManager.playSound('dig');
  };

  if (!currentLevel) {
    return null;
  }

  return (
    <CRTEffect enabled={true}>
      <View style={styles.container}>
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT - 200} style={styles.gameCanvas}>
          {/* Render tiles */}
          {currentLevel.tiles.map((row, y) =>
            row.map((tile, x) => {
              if (tile === '#') {
                return (
                  <Rect
                    key={`${x}-${y}`}
                    x={x * TILE_SIZE}
                    y={y * TILE_SIZE}
                    width={TILE_SIZE}
                    height={TILE_SIZE}
                    fill={COLORS.ORANGE}
                  />
                );
              }
              if (tile === '=') {
                return (
                  <Rect
                    key={`${x}-${y}`}
                    x={x * TILE_SIZE + 6}
                    y={y * TILE_SIZE}
                    width={4}
                    height={TILE_SIZE}
                    fill={COLORS.GREEN}
                  />
                );
              }
              if (tile === '-') {
                return (
                  <Rect
                    key={`${x}-${y}`}
                    x={x * TILE_SIZE}
                    y={y * TILE_SIZE + 6}
                    width={TILE_SIZE}
                    height={4}
                    fill={COLORS.BLUE}
                  />
                );
              }
              return null;
            })
          )}

          {/* Render gold */}
          {gold.map(
            g =>
              !g.collected && (
                <Circle
                  key={g.id}
                  cx={g.x + 6}
                  cy={g.y + 6}
                  r={5}
                  fill={COLORS.PURPLE}
                />
              )
          )}

          {/* Render enemies */}
          {enemies.map(e => (
            <Rect
              key={e.id}
              x={e.x}
              y={e.y}
              width={e.width}
              height={e.height}
              fill={COLORS.PURPLE}
            />
          ))}

          {/* Render player */}
          <Rect
            x={player.x}
            y={player.y}
            width={player.width}
            height={player.height}
            fill={COLORS.GREEN}
          />

          {/* UI */}
          <SvgText x={10} y={20} fill={COLORS.WHITE} fontSize={14} fontFamily="monospace">
            SCORE: {score}
          </SvgText>
          <SvgText x={SCREEN_WIDTH - 80} y={20} fill={COLORS.WHITE} fontSize={14} fontFamily="monospace">
            LIVES: {lives}
          </SvgText>
        </Svg>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.joystickContainer}>
            <VirtualJoystick
              onMove={handleJoystickMove}
              onRelease={handleJoystickRelease}
            />
          </View>

          <View style={styles.buttonsContainer}>
            <ActionButtons onPressA={handleActionA} onPressB={handleActionB} />
          </View>
        </View>
      </View>
    </CRTEffect>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  gameCanvas: {
    backgroundColor: COLORS.BLACK,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  joystickContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
