import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import Colors from '@/assets/fonts/color.js';
import Nav from '@/components/Nav';

const etre = [
  { label: 'mɛ ̀ Ńíòm : je marche', file: require('@/assets/sounds/bassa/verbe5/1.wav') },
  { label: '̀ Ńíòm  : tu marches', file: require('@/assets/sounds/bassa/verbe5/2.wav') },
  { label: 'A Ńíòm : il ou elle marche', file: require('@/assets/sounds/bassa/verbe5/3.wav') },
  { label: 'Di Ńíòm : nous marchons', file: require('@/assets/sounds/bassa/verbe5/4.wav') },
  { label: 'Ni Ńíòm : vous marchez', file: require('@/assets/sounds/bassa/verbe5/5.wav') },
  { label: 'Ba Ńíòm : ils ou elles marchent', file: require('@/assets/sounds/bassa/verbe5/6.wav') },
];

export default function bassaEtreLesson() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [played, setPlayed] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [mascotAnim] = useState(new Animated.Value(1));
  const [successAnim] = useState(new Animated.Value(0));
  const [showConfetti, setShowConfetti] = useState(false);

  const playSuccessSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/success.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Erreur son de réussite :', error);
    }
  };

  const handlePlay = async (index: number) => {
    try {
      setIsPlaying(index);
      animateMascotte();
      const { sound } = await Audio.Sound.createAsync(etre[index].file);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(null);
        }
      });

      if (!played.includes(index)) {
        const updated = [...played, index];
        setPlayed(updated);
        if (updated.length === etre.length) {
          triggerSuccessAnimation();
          await playSuccessSound();
        }
      }
    } catch (err) {
      console.log('Erreur audio :', err);
    }
  };

  const animateMascotte = () => {
    Animated.sequence([
      Animated.timing(mascotAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(mascotAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const triggerSuccessAnimation = () => {
    setShowConfetti(true);
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setShowConfetti(false), 2000);
    });
  };

  const isLessonCompleted = played.length === etre.length;

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Nav />

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/sage2')}>
        <Text style={styles.backButtonText}>⬅️ Retour</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🙋🏾‍♂️ Leçon 6 : Le verbe marcher en bassa</Text>
        <Text style={styles.instruction}>🎧 Appuie sur chaque phrase pour écouter</Text>

        <Animated.Image
          source={require('@/assets/images/mascotte.png')}
          style={[styles.mascot, { transform: [{ scale: mascotAnim }] }]}
        />

        {showConfetti && (
          <Animated.View style={[styles.confettiContainer, { opacity: successAnim }]}>
            <Image source={require('@/assets/images/star.png')} style={styles.starIcon} />
            <Text style={styles.confettiText}>🎉 Bravo !</Text>
          </Animated.View>
        )}

        {etre.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.item,
              played.includes(index) && styles.played,
              isPlaying === index && styles.playing,
            ]}
            onPress={() => handlePlay(index)}
          >
            <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
            <Text style={styles.itemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.nextButton, !isLessonCompleted && styles.disabledButton]}
          disabled={!isLessonCompleted}
          onPress={() => router.push('/bassa/lesson7')}
        >
          <Text style={styles.nextButtonText}>
            {isLessonCompleted ? '✅ Leçon suivante' : 'Terminez la leçon'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffefb',
    paddingTop: 70,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbb',
    zIndex: 999,
  },
  backButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.logo,
  },
  instruction: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  mascot: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.gris,
  },
  played: {
    backgroundColor: '#dcfce7',
    borderColor: '#15803d',
  },
  playing: {
    backgroundColor: '#e0e7ff',
    borderColor: '#4338ca',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '600',
  },
  audioIcon: {
    width: 24,
    height: 24,
  },
  nextButton: {
    backgroundColor: Colors.logo2,
    paddingVertical: 15,
    marginTop: 30,
    borderRadius: 25,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: Colors.logo,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    borderColor: '#999',
  },
  confettiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confettiText: {
    fontSize: 22,
    color: 'green',
    fontWeight: '800',
    marginLeft: 10,
  },
  starIcon: {
    width: 36,
    height: 36,
  },
});
