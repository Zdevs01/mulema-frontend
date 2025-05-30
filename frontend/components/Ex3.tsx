import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '@/assets/fonts/color';
import NavTime from '@/components/navTime';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export default function Ex3() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const soundRef = useRef(null);
  const [hasListened, setHasListened] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const [btkButtons, setBtkButtons] = useState([
    { id: 1, label: 'Bonjour' },
    { id: 2, label: 'Mbote (Salut en lingala)' },
    { id: 3, label: 'A kwɛ (Salut en bassa)' }, // ✅ Bonne réponse
    { id: 4, label: 'Ndolè (Plat traditionnel camerounais)' },
  ]);

  const [reponseButtons, setReponseButtons] = useState([]);

  const correctAnswerId = 3;

  const playAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/audio3.wav') // ton audio
      );
      soundRef.current = sound;
      await sound.playAsync();
      setHasListened(true);
    } catch (err) {
      console.error('Erreur audio', err);
    }
  };

  const moveButtonToReponse = async (id) => {
    if (!hasListened) {
      Alert.alert("🎧 Écoute obligatoire", "Écoute l'audio avant de choisir une réponse.");
      return;
    }

    const alreadySelected = reponseButtons.find((btn) => btn.id === id);
    if (alreadySelected) return;

    const button = btkButtons.find((btn) => btn.id === id);
    if (button) {
      setBtkButtons(btkButtons.filter((btn) => btn.id !== id));
      setReponseButtons([...reponseButtons, button]);

      if (id === correctAnswerId) {
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/success.mp3'));
        await sound.playAsync();
        setTimeout(() => {
          router.push('/ex4');
        }, 2000);
      } else {
        setErrorCount(errorCount + 1);
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/fail.mp3'));
        await sound.playAsync();
      }
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <NavTime />
      <ScrollView style={styles.contain} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.text1}>🎧 Écoute et sélectionne la bonne traduction</Text>

        <View style={styles.prog}>
          <TouchableOpacity style={styles.msg} onPress={playAudio}>
            <View style={styles.caf}>
              <Image source={require('@/assets/images/audio.png')} style={styles.img} />
            </View>
            <Text>▶️ Audio ici</Text>
          </TouchableOpacity>

          <View style={styles.btk}>
            {btkButtons.map((button) => (
              <TouchableOpacity
                key={button.id}
                style={styles.option}
                onPress={() => moveButtonToReponse(button.id)}
              >
                <Text style={styles.optionText}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.responseTitle}>Ta réponse :</Text>
          <View style={styles.responseBox}>
            {reponseButtons.map((button) => (
              <View key={button.id} style={styles.response}>
                <Text style={styles.responseText}>{button.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.errorText}>❌ Erreurs : {errorCount}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  contain: {
    backgroundColor: Colors.white,
    marginTop: 29,
    height: '100%',
  },
  prog: {
    padding: Colors.padding,
    gap: 10,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  caf: {
    width: 20,
    height: 20,
  },
  msg: {
    width: '80%',
    borderRadius: Colors.radius2,
    height: 50,
    borderWidth: 3,
    backgroundColor: Colors.white,
    borderColor: Colors.gris,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  btk: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.gris,
    borderRadius: Colors.radius2,
    padding: Colors.padding,
  },
  text1: {
    fontFamily: Colors.font,
    fontWeight: '700',
    fontSize: 18,
    paddingHorizontal: Colors.padding,
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#f3f3f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.gris,
  },
  optionText: {
    fontWeight: '600',
    color: '#333',
  },
  responseTitle: {
    marginTop: 20,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: Colors.padding,
  },
  responseBox: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Colors.logo2,
    borderRadius: 15,
    padding: 10,
    margin: Colors.padding,
    minHeight: 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  response: {
    backgroundColor: Colors.vert,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  responseText: {
    color: 'white',
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    color: '#cc0000',
    fontWeight: 'bold',
    marginTop: 20,
  },
});
