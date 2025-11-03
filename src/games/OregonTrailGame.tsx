import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { CRTEffect } from '../components/CRTEffect';
import { COLORS, UI_COLORS } from '../constants/Colors';
import { SoundManager } from '../utils/SoundManager';
import * as Haptics from 'expo-haptics';

interface OregonTrailGameProps {
  onGameOver?: (score: number) => void;
  onExit?: () => void;
}

interface GameState {
  money: number;
  food: number;
  ammunition: number;
  clothing: number;
  oxen: number;
  spareWheels: number;
  spareAxles: number;
  spareTongues: number;
  health: number;
  milesTraeled: number;
  totalMiles: number;
  day: number;
  month: string;
}

type GamePhase =
  | 'intro'
  | 'shopping'
  | 'traveling'
  | 'event'
  | 'hunting'
  | 'river'
  | 'won'
  | 'died';

const MONTHS = [
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const RANDOM_EVENTS = [
  { text: 'You found wild fruit along the trail!', food: 20, health: 0 },
  { text: 'Heavy rains slow you down.', food: 0, health: -5 },
  { text: 'One of your oxen is injured.', food: 0, health: -10 },
  { text: 'You find a freshwater spring!', food: 0, health: 10 },
  { text: 'Bandits steal some supplies!', food: -30, health: 0 },
  { text: 'A wagon wheel breaks!', food: 0, health: 0 },
  { text: 'Someone in your party has dysentery!', food: 0, health: -20 },
  { text: 'Clear weather speeds your travel.', food: 0, health: 5 },
  { text: 'You meet friendly traders!', food: 15, health: 0 },
  { text: 'Extreme heat exhausts the oxen.', food: -10, health: -10 },
];

export const OregonTrailGame: React.FC<OregonTrailGameProps> = ({
  onGameOver,
  onExit,
}) => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [gameState, setGameState] = useState<GameState>({
    money: 700,
    food: 0,
    ammunition: 0,
    clothing: 0,
    oxen: 0,
    spareWheels: 0,
    spareAxles: 0,
    spareTongues: 0,
    health: 100,
    milesTraeled: 0,
    totalMiles: 2040,
    day: 1,
    month: 'March',
  });
  const [message, setMessage] = useState('');
  const [eventText, setEventText] = useState('');

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('shopping');
  };

  const handleBuy = (item: string, cost: number, amount: number) => {
    if (gameState.money >= cost) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - cost,
        [item]: (prev[item as keyof GameState] as number) + amount,
      }));
      SoundManager.playSound('collect');
    }
  };

  const handleFinishShopping = () => {
    if (gameState.oxen < 2) {
      setMessage('You need at least 2 oxen!');
      return;
    }
    if (gameState.food < 50) {
      setMessage('You need at least 50 pounds of food!');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('traveling');
    setMessage('');
  };

  const handleContinueTravel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Random event chance
    if (Math.random() < 0.3) {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setEventText(event.text);
      setGameState(prev => ({
        ...prev,
        food: Math.max(0, prev.food + event.food),
        health: Math.max(0, Math.min(100, prev.health + event.health)),
      }));
      setPhase('event');
      return;
    }

    // River crossing chance
    if (Math.random() < 0.15) {
      setPhase('river');
      return;
    }

    // Hunting opportunity
    if (Math.random() < 0.2 && gameState.ammunition > 10) {
      setPhase('hunting');
      return;
    }

    // Regular travel
    travel();
  };

  const travel = () => {
    const milesPerDay = 15 + Math.floor(Math.random() * 10);
    const foodConsumed = 5 + Math.floor(Math.random() * 5);

    setGameState(prev => {
      const newMiles = prev.milesTraeled + milesPerDay;
      const newFood = Math.max(0, prev.food - foodConsumed);
      let newHealth = prev.health;

      // Health decreases if out of food
      if (newFood === 0) {
        newHealth -= 10;
      }

      // Advance day and month
      let newDay = prev.day + 1;
      let monthIndex = MONTHS.indexOf(prev.month);

      if (newDay > 30) {
        newDay = 1;
        monthIndex = Math.min(monthIndex + 1, MONTHS.length - 1);
      }

      // Check win condition
      if (newMiles >= prev.totalMiles) {
        setPhase('won');
        const finalScore = newHealth * 10 + prev.money + prev.food;
        onGameOver?.(finalScore);
      }

      // Check death condition
      if (newHealth <= 0) {
        setPhase('died');
        onGameOver?.(0);
      }

      return {
        ...prev,
        milesTraeled: newMiles,
        food: newFood,
        health: newHealth,
        day: newDay,
        month: MONTHS[monthIndex],
      };
    });
  };

  const handleHunt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const success = Math.random() > 0.4;
    const ammoCost = 10;
    const foodGained = success ? 50 + Math.floor(Math.random() * 50) : 0;

    setGameState(prev => ({
      ...prev,
      ammunition: prev.ammunition - ammoCost,
      food: prev.food + foodGained,
    }));

    if (success) {
      setMessage(`Success! You shot game worth ${foodGained} pounds of food!`);
      SoundManager.playSound('collect');
    } else {
      setMessage('You missed! Better luck next time.');
      SoundManager.playSound('die');
    }

    setTimeout(() => {
      setMessage('');
      setPhase('traveling');
      travel();
    }, 2000);
  };

  const handleCrossRiver = (method: 'ford' | 'caulk' | 'ferry') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let success = true;
    let healthLoss = 0;
    let moneyLost = 0;

    switch (method) {
      case 'ford':
        success = Math.random() > 0.3;
        healthLoss = success ? 5 : 30;
        break;
      case 'caulk':
        success = Math.random() > 0.2;
        healthLoss = success ? 0 : 20;
        break;
      case 'ferry':
        if (gameState.money >= 10) {
          success = true;
          moneyLost = 10;
        } else {
          setMessage('Not enough money for ferry!');
          return;
        }
        break;
    }

    setGameState(prev => ({
      ...prev,
      health: Math.max(0, prev.health - healthLoss),
      money: prev.money - moneyLost,
    }));

    if (success) {
      setMessage('You made it across safely!');
      SoundManager.playSound('collect');
    } else {
      setMessage('You lost supplies crossing the river!');
      SoundManager.playSound('die');
    }

    setTimeout(() => {
      setMessage('');
      if (gameState.health - healthLoss <= 0) {
        setPhase('died');
      } else {
        setPhase('traveling');
        travel();
      }
    }, 2000);
  };

  const handleEventContinue = () => {
    setPhase('traveling');
    travel();
  };

  const renderIntro = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>THE OREGON TRAIL</Text>
      <Text style={styles.text}>
        It is 1848. Your journey begins in Independence, Missouri, and ends in
        Oregon City. You must travel 2,040 miles by covered wagon.
      </Text>
      <Text style={styles.text}>
        The journey will be dangerous. Disease, starvation, and accidents are
        just a few of the hazards you will face.
      </Text>
      <Text style={styles.text}>
        Will you and your family survive the journey?
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>START YOUR JOURNEY</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onExit}>
        <Text style={styles.secondaryButtonText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );

  const renderShopping = () => (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.title}>MATT'S GENERAL STORE</Text>
      <Text style={styles.text}>Money: ${gameState.money}</Text>
      <Text style={styles.divider}>───────────────────────</Text>

      <View style={styles.shopItem}>
        <Text style={styles.text}>Oxen - $40 each (have: {gameState.oxen})</Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => handleBuy('oxen', 40, 1)}
        >
          <Text style={styles.buttonText}>BUY</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.shopItem}>
        <Text style={styles.text}>Food - $0.20/lb (have: {gameState.food})</Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => handleBuy('food', 20, 100)}
        >
          <Text style={styles.buttonText}>BUY 100</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.shopItem}>
        <Text style={styles.text}>
          Ammunition - $2 per box (have: {gameState.ammunition})
        </Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => handleBuy('ammunition', 2, 50)}
        >
          <Text style={styles.buttonText}>BUY 50</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.shopItem}>
        <Text style={styles.text}>
          Clothing - $10 per set (have: {gameState.clothing})
        </Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => handleBuy('clothing', 10, 1)}
        >
          <Text style={styles.buttonText}>BUY</Text>
        </TouchableOpacity>
      </View>

      {message ? <Text style={styles.warning}>{message}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleFinishShopping}>
        <Text style={styles.buttonText}>BEGIN JOURNEY</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTraveling = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>ON THE TRAIL</Text>
      <Text style={styles.text}>{gameState.month} {gameState.day}, 1848</Text>
      <Text style={styles.divider}>───────────────────────</Text>
      <Text style={styles.text}>Miles traveled: {gameState.milesTraeled}</Text>
      <Text style={styles.text}>
        Miles to Oregon: {gameState.totalMiles - gameState.milesTraeled}
      </Text>
      <Text style={styles.divider}>───────────────────────</Text>
      <Text style={styles.text}>Health: {gameState.health}</Text>
      <Text style={styles.text}>Food: {gameState.food} lbs</Text>
      <Text style={styles.text}>Ammunition: {gameState.ammunition}</Text>
      <Text style={styles.text}>Money: ${gameState.money}</Text>
      <Text style={styles.divider}>───────────────────────</Text>

      <TouchableOpacity style={styles.button} onPress={handleContinueTravel}>
        <Text style={styles.buttonText}>CONTINUE ON TRAIL</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEvent = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>TRAIL EVENT</Text>
      <Text style={styles.eventText}>{eventText}</Text>
      <TouchableOpacity style={styles.button} onPress={handleEventContinue}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHunting = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>HUNTING</Text>
      <Text style={styles.text}>You see game nearby!</Text>
      <Text style={styles.text}>Ammunition: {gameState.ammunition}</Text>
      <TouchableOpacity style={styles.button} onPress={handleHunt}>
        <Text style={styles.buttonText}>FIRE!</Text>
      </TouchableOpacity>
      {message ? <Text style={styles.eventText}>{message}</Text> : null}
    </View>
  );

  const renderRiver = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>RIVER CROSSING</Text>
      <Text style={styles.text}>You must cross a river!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCrossRiver('ford')}
      >
        <Text style={styles.buttonText}>FORD THE RIVER</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCrossRiver('caulk')}
      >
        <Text style={styles.buttonText}>CAULK AND FLOAT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCrossRiver('ferry')}
      >
        <Text style={styles.buttonText}>TAKE FERRY ($10)</Text>
      </TouchableOpacity>
      {message ? <Text style={styles.eventText}>{message}</Text> : null}
    </View>
  );

  const renderWon = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>CONGRATULATIONS!</Text>
      <Text style={styles.text}>You made it to Oregon!</Text>
      <Text style={styles.text}>Final Health: {gameState.health}</Text>
      <Text style={styles.text}>Final Supplies: {gameState.food} lbs food</Text>
      <Text style={styles.text}>Money Remaining: ${gameState.money}</Text>
      <TouchableOpacity style={styles.button} onPress={onExit}>
        <Text style={styles.buttonText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDied = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>YOU HAVE DIED</Text>
      <Text style={styles.text}>Your journey ends here.</Text>
      <Text style={styles.text}>Miles traveled: {gameState.milesTraeled}</Text>
      <TouchableOpacity style={styles.button} onPress={onExit}>
        <Text style={styles.buttonText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPhase = () => {
    switch (phase) {
      case 'intro':
        return renderIntro();
      case 'shopping':
        return renderShopping();
      case 'traveling':
        return renderTraveling();
      case 'event':
        return renderEvent();
      case 'hunting':
        return renderHunting();
      case 'river':
        return renderRiver();
      case 'won':
        return renderWon();
      case 'died':
        return renderDied();
    }
  };

  return (
    <CRTEffect enabled={true}>
      <SafeAreaView style={styles.container}>
        {renderPhase()}
      </SafeAreaView>
    </CRTEffect>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.BACKGROUND,
  },
  screenContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: UI_COLORS.TEXT,
    fontFamily: 'monospace',
    marginVertical: 4,
    lineHeight: 24,
  },
  eventText: {
    fontSize: 18,
    color: UI_COLORS.SECONDARY,
    fontFamily: 'monospace',
    marginVertical: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  divider: {
    fontSize: 14,
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    marginVertical: 8,
    opacity: 0.5,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: UI_COLORS.PRIMARY,
    backgroundColor: `${UI_COLORS.PRIMARY}20`,
    alignSelf: 'center',
    minWidth: 250,
  },
  buttonText: {
    fontSize: 16,
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: UI_COLORS.SECONDARY,
    backgroundColor: `${UI_COLORS.SECONDARY}10`,
    alignSelf: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: UI_COLORS.SECONDARY,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: UI_COLORS.PRIMARY,
    backgroundColor: `${UI_COLORS.PRIMARY}20`,
  },
  warning: {
    fontSize: 14,
    color: COLORS.ORANGE,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginVertical: 12,
  },
});
