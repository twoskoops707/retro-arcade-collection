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
import { UI_COLORS } from '../constants/Colors';
import { SoundManager } from '../utils/SoundManager';
import * as Haptics from 'expo-haptics';

interface Location {
  name: string;
  continent: string;
  clues: string[];
  landmarks: string[];
}

interface Suspect {
  name: string;
  hairColor: string;
  eyeColor: string;
  hobby: string;
  vehicle: string;
}

const LOCATIONS: Location[] = [
  {
    name: 'New York',
    continent: 'North America',
    clues: [
      'They mentioned taking a taxi',
      'They said something about a big green statue',
      'They were headed to see a Broadway show',
    ],
    landmarks: ['Statue of Liberty', 'Empire State Building', 'Times Square'],
  },
  {
    name: 'London',
    continent: 'Europe',
    clues: [
      'They wanted to see Big Ben',
      'They mentioned riding a double-decker bus',
      'They were looking for fish and chips',
    ],
    landmarks: ['Big Ben', 'Tower Bridge', 'Buckingham Palace'],
  },
  {
    name: 'Tokyo',
    continent: 'Asia',
    clues: [
      'They were excited about sushi',
      'They mentioned Mount Fuji',
      'They wanted to ride the bullet train',
    ],
    landmarks: ['Tokyo Tower', 'Mount Fuji', 'Shibuya Crossing'],
  },
  {
    name: 'Cairo',
    continent: 'Africa',
    clues: [
      'They wanted to see the pyramids',
      'They mentioned the Nile River',
      'They were looking for hieroglyphics',
    ],
    landmarks: ['Pyramids of Giza', 'Sphinx', 'Nile River'],
  },
  {
    name: 'Sydney',
    continent: 'Australia',
    clues: [
      'They mentioned kangaroos',
      'They wanted to see a famous opera house',
      'They were going to the beach',
    ],
    landmarks: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach'],
  },
  {
    name: 'Rio de Janeiro',
    continent: 'South America',
    clues: [
      'They mentioned a giant statue',
      'They wanted to see Carnival',
      'They were going to the beach',
    ],
    landmarks: ['Christ the Redeemer', 'Copacabana Beach', 'Sugarloaf Mountain'],
  },
];

const SUSPECTS: Suspect[] = [
  {
    name: 'Carmen Sandiego',
    hairColor: 'Brown',
    eyeColor: 'Brown',
    hobby: 'Collecting artifacts',
    vehicle: 'Red sports car',
  },
  {
    name: 'Merey LaRoc',
    hairColor: 'Blonde',
    eyeColor: 'Blue',
    hobby: 'Rock climbing',
    vehicle: 'Motorcycle',
  },
  {
    name: 'Scar Graynolt',
    hairColor: 'Black',
    eyeColor: 'Green',
    hobby: 'Chess',
    vehicle: 'Black sedan',
  },
  {
    name: 'Nick Brunch',
    hairColor: 'Red',
    eyeColor: 'Hazel',
    hobby: 'Cooking',
    vehicle: 'Food truck',
  },
];

interface CarmenSandiegoGameProps {
  onGameOver?: (score: number) => void;
  onExit?: () => void;
}

type GamePhase = 'intro' | 'briefing' | 'investigating' | 'travel' | 'arrest' | 'won' | 'lost';

export const CarmenSandiegoGame: React.FC<CarmenSandiegoGameProps> = ({
  onGameOver,
  onExit,
}) => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentLocation, setCurrentLocation] = useState<Location>(LOCATIONS[0]);
  const [targetSuspect, setTargetSuspect] = useState<Suspect>(SUSPECTS[0]);
  const [trail, setTrail] = useState<Location[]>([]);
  const [cluesFound, setCluesFound] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(7);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase === 'intro') {
      // Initialize game
      const randomSuspect = SUSPECTS[Math.floor(Math.random() * SUSPECTS.length)];
      setTargetSuspect(randomSuspect);

      // Create trail (3-5 locations)
      const numLocations = 3 + Math.floor(Math.random() * 3);
      const selectedLocations: Location[] = [];
      const availableLocations = [...LOCATIONS];

      for (let i = 0; i < numLocations; i++) {
        const index = Math.floor(Math.random() * availableLocations.length);
        selectedLocations.push(availableLocations[index]);
        availableLocations.splice(index, 1);
      }

      setTrail(selectedLocations);
      setCurrentLocation(selectedLocations[0]);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'investigating' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 60000); // 1 minute

      return () => clearTimeout(timer);
    }

    if (timeRemaining === 0) {
      setPhase('lost');
      onGameOver?.(score);
    }
  }, [timeRemaining, phase]);

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('briefing');
  };

  const handleStartInvestigation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('investigating');
  };

  const handleInvestigate = (location: 'police' | 'airport' | 'landmark') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    let newClue = '';
    switch (location) {
      case 'police':
        newClue = `Hair: ${targetSuspect.hairColor}`;
        break;
      case 'airport':
        newClue = `Vehicle: ${targetSuspect.vehicle}`;
        break;
      case 'landmark':
        newClue = currentLocation.clues[Math.floor(Math.random() * currentLocation.clues.length)];
        break;
    }

    if (!cluesFound.includes(newClue)) {
      setCluesFound(prev => [...prev, newClue]);
      setScore(prev => prev + 10);
      SoundManager.playSound('collect');
    }
  };

  const handleTravel = (destination: Location) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const currentIndex = trail.findIndex(loc => loc.name === currentLocation.name);

    if (destination.name === trail[currentIndex + 1]?.name) {
      // Correct destination
      setCurrentLocation(destination);
      setScore(prev => prev + 50);
      SoundManager.playSound('collect');

      if (currentIndex + 1 === trail.length - 1) {
        // Last location - time to arrest
        setPhase('arrest');
      } else {
        setPhase('investigating');
      }
    } else {
      // Wrong destination - lose time
      setTimeRemaining(prev => Math.max(0, prev - 1));
      SoundManager.playSound('die');
      setPhase('investigating');
    }
  };

  const handleArrest = (suspect: Suspect) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (suspect.name === targetSuspect.name) {
      setScore(prev => prev + 200);
      setPhase('won');
      onGameOver?.(score + 200);
      SoundManager.playSound('level_complete');
    } else {
      setPhase('lost');
      onGameOver?.(score);
      SoundManager.playSound('die');
    }
  };

  const renderIntro = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>WHERE IN THE WORLD IS</Text>
      <Text style={styles.titleLarge}>CARMEN SANDIEGO?</Text>
      <Text style={styles.text}>
        A priceless artifact has been stolen! Follow the clues around the world
        to catch the thief before time runs out.
      </Text>
      <Text style={styles.text}>
        Question witnesses, gather evidence, and make your arrest!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>START INVESTIGATION</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onExit}>
        <Text style={styles.secondaryButtonText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBriefing = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>CHIEF'S BRIEFING</Text>
      <Text style={styles.text}>
        A valuable artifact has been stolen! Your mission is to track down the
        thief and recover the artifact.
      </Text>
      <Text style={styles.text}>
        You have {timeRemaining} days to solve this case.
      </Text>
      <Text style={styles.text}>
        Start your investigation in {currentLocation.name}.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStartInvestigation}>
        <Text style={styles.buttonText}>BEGIN INVESTIGATION</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInvestigating = () => (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.title}>{currentLocation.name.toUpperCase()}</Text>
      <Text style={styles.subtitle}>{currentLocation.continent}</Text>
      <Text style={styles.divider}>───────────────────────</Text>
      <Text style={styles.text}>Time Remaining: {timeRemaining} days</Text>
      <Text style={styles.text}>Score: {score}</Text>
      <Text style={styles.divider}>───────────────────────</Text>

      <Text style={styles.sectionTitle}>INVESTIGATE:</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleInvestigate('police')}
      >
        <Text style={styles.buttonText}>POLICE STATION</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleInvestigate('airport')}
      >
        <Text style={styles.buttonText}>AIRPORT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleInvestigate('landmark')}
      >
        <Text style={styles.buttonText}>LOCAL LANDMARK</Text>
      </TouchableOpacity>

      {cluesFound.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>CLUES FOUND:</Text>
          {cluesFound.map((clue, index) => (
            <Text key={index} style={styles.clue}>
              • {clue}
            </Text>
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>TRAVEL TO:</Text>
      {LOCATIONS.filter(loc => loc.name !== currentLocation.name)
        .slice(0, 3)
        .map(loc => (
          <TouchableOpacity
            key={loc.name}
            style={styles.button}
            onPress={() => handleTravel(loc)}
          >
            <Text style={styles.buttonText}>{loc.name.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );

  const renderArrest = () => (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.title}>MAKE YOUR ARREST!</Text>
      <Text style={styles.text}>
        You've tracked the suspect to {currentLocation.name}!
      </Text>
      <Text style={styles.text}>Based on your clues, who is the thief?</Text>
      <Text style={styles.divider}>───────────────────────</Text>

      {SUSPECTS.map(suspect => (
        <TouchableOpacity
          key={suspect.name}
          style={styles.suspectButton}
          onPress={() => handleArrest(suspect)}
        >
          <Text style={styles.buttonText}>{suspect.name.toUpperCase()}</Text>
          <Text style={styles.suspectDetail}>Hair: {suspect.hairColor}</Text>
          <Text style={styles.suspectDetail}>Eyes: {suspect.eyeColor}</Text>
          <Text style={styles.suspectDetail}>Vehicle: {suspect.vehicle}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderWon = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>CASE SOLVED!</Text>
      <Text style={styles.text}>
        Congratulations, detective! You caught {targetSuspect.name} and
        recovered the stolen artifact!
      </Text>
      <Text style={styles.text}>Final Score: {score}</Text>
      <TouchableOpacity style={styles.button} onPress={onExit}>
        <Text style={styles.buttonText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLost = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>CASE CLOSED</Text>
      <Text style={styles.text}>
        {timeRemaining === 0
          ? 'Time ran out! The thief escaped.'
          : 'Wrong arrest! The real thief got away.'}
      </Text>
      <Text style={styles.text}>
        The thief was {targetSuspect.name}.
      </Text>
      <Text style={styles.text}>Final Score: {score}</Text>
      <TouchableOpacity style={styles.button} onPress={onExit}>
        <Text style={styles.buttonText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPhase = () => {
    switch (phase) {
      case 'intro':
        return renderIntro();
      case 'briefing':
        return renderBriefing();
      case 'investigating':
        return renderInvestigating();
      case 'arrest':
        return renderArrest();
      case 'won':
        return renderWon();
      case 'lost':
        return renderLost();
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_COLORS.SECONDARY,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: UI_COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: UI_COLORS.TEXT,
    fontFamily: 'monospace',
    marginVertical: 4,
    lineHeight: 22,
  },
  divider: {
    fontSize: 12,
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    marginVertical: 8,
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UI_COLORS.SECONDARY,
    fontFamily: 'monospace',
    marginTop: 16,
    marginBottom: 8,
  },
  clue: {
    fontSize: 14,
    color: UI_COLORS.PRIMARY,
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: UI_COLORS.PRIMARY,
    backgroundColor: `${UI_COLORS.PRIMARY}20`,
  },
  buttonText: {
    fontSize: 14,
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
  suspectButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: UI_COLORS.SECONDARY,
    backgroundColor: `${UI_COLORS.SECONDARY}15`,
  },
  suspectDetail: {
    fontSize: 12,
    color: UI_COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    marginTop: 2,
  },
});
