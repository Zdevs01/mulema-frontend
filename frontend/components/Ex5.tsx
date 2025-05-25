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
} from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '@/assets/fonts/color';
import NavTime from '@/components/navTime';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

export default function Ex3() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();

  const [btkButtons, setBtkButtons] = useState([
    { id: 1, label: 'Bonjour' },
    { id: 2, label: 'Mbote (Salut en lingala)' },
    { id: 3, label: 'A kwɛ (Salut en bassa)' }, // ✅ bonne réponse
    { id: 4, label: 'Ndolè (Plat traditionnel camerounais)' },
  ]);
  const [reponseButtons, setReponseButtons] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const correctAnswerId = 3;
  const audioRef = useRef(null);

  const playAudio = async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/audio3.wav')
      );
      audioRef.current = sound;
      await sound.playAsync();
      setAudioPlayed(true);
    } catch (error) {
      console.log("Erreur audio:", error);
    }
  };

  const moveButtonToReponse = (id) => {
    if (!audioPlayed) {
      Alert.alert("⛔ Attends !", "Tu dois écouter l'audio avant de répondre.");
      return;
    }

    if (reponseButtons.length > 0) return;

    const button = btkButtons.find((btn) => btn.id === id);
    if (button) {
      setBtkButtons(btkButtons.filter((btn) => btn.id !== id));
      setReponseButtons([button]);

      if (button.id !== correctAnswerId) {
        setErrorCount((prev) => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (reponseButtons.length === 0) {
      Alert.alert("⛔ Attention", "Veuillez sélectionner une réponse avant de continuer.");
      return;
    }

    router.push("/ex4");
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <NavTime />
      <ScrollView style={styles.contain} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>🎧 Écoute et sélectionne la bonne réponse</Text>

        <View style={styles.prog}>
          <View style={styles.flex}>
            <Image source={require('@/assets/images/vide.png')} style={styles.imageLeft} />
            <TouchableOpacity style={styles.audioBlock} onPress={playAudio}>
              <Image source={require('@/assets/images/audio.png')} style={styles.iconAudio} />
              <Text style={styles.audioText}>📢 Écouter l’audio</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subTitle}>🧠 Ta réponse :</Text>
          <View style={styles.responseBox}>
            {reponseButtons.map((button) => (
              <View key={button.id} style={styles.response}>
                <Text style={styles.responseText}>{button.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subTitle}>✋ Choisis une réponse :</Text>
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
        </View>

        <Text style={styles.errorText}>❌ Erreurs : {errorCount}</Text>

        <View style={styles.btn}>
          <TouchableOpacity style={[styles.button, styles.inverse]} onPress={handleNext}>
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
    paddingTop: 20,
  },
  title: {
    fontFamily: Colors.font,
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  prog: {
    marginTop: 10,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageLeft: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 15,
  },
  audioBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gris,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  iconAudio: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  audioText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.logo,
  },
  subTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 10,
  },
  responseBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 10,
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
    marginBottom: 20,
  },
  response: {
    backgroundColor: Colors.vert,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  responseText: {
    color: '#fff',
    fontWeight: '600',
  },
  btk: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    backgroundColor: '#f3f3f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.gris,
  },
  optionText: {
    fontWeight: '600',
    color: '#333',
  },
  errorText: {
    textAlign: 'center',
    color: Colors.logo,
    fontWeight: '700',
    marginTop: 20,
    fontSize: 16,
  },
  btn: {
    marginTop: 30,
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
    letterSpacing: 0.8,
    lineHeight: 20,
  },
  inverseText: {
    color: '#fff',
  },
});
