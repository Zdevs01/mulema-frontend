import React, { useState, useRef } from 'react';
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
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import Colors from '@/assets/fonts/color';
import NavTime from '@/components/navTime';
import { useRouter } from 'expo-router';

const screen = Dimensions.get('window');

export default function Ex4() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const correctIndex = 2;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [progressAnim] = useState(new Animated.Value(0));
  const audioRef = useRef<Audio.Sound | null>(null);

  const playAudio = async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/audio4.wav')
      );
      audioRef.current = sound;
      await sound.playAsync();
      setAudioPlayed(true);
    } catch (err) {
      console.error('Audio Error:', err);
    }
  };

  const playSuccessSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/success.wav')
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

  const handleSelection = async (index: number) => {
    if (!audioPlayed || disabled || showSuccess) return;
    setSelectedIndex(index);
    setDisabled(true);
    startProgress();

    setTimeout(async () => {
      if (index === correctIndex) {
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        await playSuccessSound();
        setShowSuccess(true);
      } else {
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        setSelectedIndex(null);
      }
      resetProgress();
      setDisabled(false);
    }, 1200);
  };

  const handleNext = () => {
    if (showSuccess) {
      router.push('/ex5');
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
          <Text style={styles.successEmoji}>🎯</Text>
          <Text style={styles.successMessage}>Bonne réponse !</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.contain}>
        <Text style={styles.text1}>Sélectionnez la bonne image</Text>

        <View style={styles.prog}>
          <View style={styles.msg}>
            <TouchableOpacity onPress={playAudio} style={styles.audioBlock}>
              <Image
                source={require('@/assets/images/audio.png')}
                style={styles.audioIcon}
              />
              <Text>Contenu audible - cliquer pour écouter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {[0, 1, 2, 3].map((index) => (
              <TouchableOpacity
                key={index}
                style={[styles.box, selectedIndex === index && styles.selectedBox]}
                onPress={() => handleSelection(index)}
              >
                <Image
                  source={require('@/assets/images/vide.png')}
                  style={styles.img}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Animated.View style={[styles.timerBar, { width: progressAnim }]} />

        <View style={styles.btn}>
          <TouchableOpacity
            style={[styles.button, styles.inverse]}
            onPress={handleNext}
            disabled={!showSuccess}
          >
            <Text style={[styles.buttonText, styles.inverseText]}>Suivant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  contain: {
    backgroundColor: Colors.white,
    paddingHorizontal: Colors.padding,
    paddingTop: 30,
  },
  text1: {
    fontFamily: Colors.font,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  prog: {
    gap: 10,
  },
  msg: {
    marginBottom: 20,
  },
  audioBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.gris,
    backgroundColor: Colors.white,
  },
  audioIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  box: {
    width: '48%',
    height: 140,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.gris,
  },
  selectedBox: {
    borderColor: Colors.logo,
    borderWidth: 3,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  btn: {
    marginTop: 40,
    marginBottom: 50,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  inverse: {
    backgroundColor: Colors.logo2,
    borderColor: Colors.logo,
    borderBottomWidth: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#fff',
  },
  inverseText: {
    color: '#fff',
  },
  timerBar: {
    height: 6,
    backgroundColor: Colors.logo,
    borderRadius: 4,
    marginTop: 20,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: screen.height,
    width: screen.width,
    backgroundColor: 'rgba(255,255,255,0.96)',
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
