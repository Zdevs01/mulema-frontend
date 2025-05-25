import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '@/assets/fonts/color';
import NavTime from '@/components/navTime';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const screen = Dimensions.get('window');

export default function Ex1() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  const [selectedPairs, setSelectedPairs] = useState<number[]>([]);
  const [correctFound, setCorrectFound] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [progressAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));

  const shuffledIndexes = [1, 5, 2, 3, 0, 4];
  const correctPair = [0, 5];

  const playSuccessSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/win.mp3')
    );
    await sound.playAsync();
  };

  const playErrorSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/error.wav')
    );
    await sound.playAsync();
  };

  const startProgress = () => {
    Animated.timing(progressAnim, {
      toValue: screen.width,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const resetProgress = () => {
    progressAnim.setValue(0);
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSelection = async (index: number) => {
    if (disabled || correctFound) return;

    const isAlreadySelected = selectedPairs.includes(index);
    if (isAlreadySelected) {
      setSelectedPairs(selectedPairs.filter((i) => i !== index));
      return;
    }

    const newSelection = [...selectedPairs, index];
    setSelectedPairs(newSelection);

    if (newSelection.length === 2) {
      setDisabled(true);
      startProgress();

      const sortedNew = [...newSelection].sort().toString();
      const sortedCorrect = [...correctPair].sort().toString();

      setTimeout(async () => {
        if (sortedNew === sortedCorrect) {
          if (Platform.OS !== 'web') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          await playSuccessSound();
          setCorrectFound(true);
          setShowSuccess(true);
        } else {
          if (Platform.OS !== 'web') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          await playErrorSound();
          setSelectedPairs([]);
          setErrorCount(prev => prev + 1);
          shake();
        }

        resetProgress();
        setDisabled(false);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (!correctFound) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } else {
      router.push('/ex2');
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <NavTime />
      {showSuccess && (
        <View style={styles.successOverlay}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successMessage}>Bonne réponse !</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.contain} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>🔗 Associe les paires d'images</Text>
        <Text style={styles.errorCounter}>❌ Erreurs : {errorCount}</Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={styles.grid}>
            {shuffledIndexes.map((index) => {
              const isSelected = selectedPairs.includes(index);
              const isCorrect = correctFound && correctPair.includes(index);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.card,
                    isSelected && styles.selectedCard,
                    isCorrect && styles.correctCard,
                  ]}
                  onPress={() => handleSelection(index)}
                  activeOpacity={0.8}
                  disabled={correctFound || disabled}
                >
                  <Image
                    source={require('@/assets/images/vide.png')}
                    style={styles.img}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View style={[styles.timerBar, { width: progressAnim }]} />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={handleNext}>
            <Text style={styles.btnText}>Suivant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  contain: {
    backgroundColor: Colors.white,
    paddingTop: 40,
    paddingHorizontal: Colors.padding,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'SpaceMono-Regular',
    color: Colors.logo,
    textAlign: 'center',
    marginBottom: 15,
  },
  errorCounter: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48%',
    height: 140,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.gris,
    elevation: 2,
  },
  selectedCard: {
    borderColor: Colors.logo,
    borderWidth: 3,
  },
  correctCard: {
    borderColor: Colors.vert,
    borderWidth: 4,
    shadowColor: Colors.vert,
    shadowOpacity: 0.4,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  timerBar: {
    height: 6,
    backgroundColor: Colors.logo,
    borderRadius: 4,
    marginTop: 20,
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.logo2,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderBottomWidth: 4,
    borderColor: Colors.logo,
    width: '100%',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: screen.height,
    width: screen.width,
    backgroundColor: 'rgba(255,255,255,0.95)',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.logo,
    marginBottom: 20,
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: Colors.logo2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderBottomWidth: 3,
    borderColor: Colors.logo,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
