import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, KeyboardAvoidingView,
  Platform, Animated, ScrollView, TouchableOpacity, Easing
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/assets/fonts/color';
import { Audio } from 'expo-av';

const messages = [
  "👋 Bienvenue, moi c’est SageBot de Mulema !",
  "Je suis ton assistant linguistique personnel. 🧠",
  "Je peux t’aider à comprendre le fonctionnement de l’application.",
  "Je peux répondre à des questions sur les langues locales.",
  "Je peux te guider dans ton apprentissage, pas à pas. 📚",
  "Je suis là pour te motiver et t’accompagner dans ton aventure ! 🚀",
  "🛑 Malheureusement, le chat en temps réel n’est pas encore disponible.",
  "Mais ne t’inquiète pas, je serai bientôt opérationnel ! 😇"
];

export default function Chat() {
  const fadeAnim = useRef(messages.map(() => new Animated.Value(0))).current;
  const avatarAnim = useRef(new Animated.Value(1)).current;
  const [showBack, setShowBack] = useState(false);
  const [typing, setTyping] = useState(false);
  const router = useRouter();

  const delayForMessage = (msg: string) => {
    const base = 30; // 30ms par caractère
    return Math.min(2500, msg.length * base);
  };

  useEffect(() => {
    const unlockAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/silence.mp3') // Doit exister dans le dossier
        );
        await sound.playAsync();
        await sound.unloadAsync();
      } catch (e) {
        console.log('Erreur déblocage audio :', e);
      }
    };

    const loadMessages = async () => {
      for (let i = 0; i < messages.length; i++) {
        setTyping(true);
        animateAvatar();

        const currentMsg = messages[i];
        await new Promise(resolve => setTimeout(resolve, delayForMessage(currentMsg)));
        setTyping(false);

        Animated.timing(fadeAnim[i], {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();

        await playSound();
        await new Promise(resolve => setTimeout(resolve, 300));

        if (i === messages.length - 1) setShowBack(true);
      }
    };

    unlockAudio();
    loadMessages();
  }, []);

  const animateAvatar = () => {
    Animated.sequence([
      Animated.timing(avatarAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(avatarAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      })
    ]).start();
  };

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/notification.mp3')
      );
      await sound.playAsync();
      await sound.unloadAsync();
    } catch (error) {
      console.log('Erreur lecture son :', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Animated.Image
          source={require('@/assets/images/sage.png')}
          style={[styles.avatar, { transform: [{ scale: avatarAnim }] }]}
        />
        <Text style={styles.headerText}>SageBot de Mulema 🤖</Text>
      </View>

      <ScrollView contentContainerStyle={styles.messages}>
        {messages.map((msg, idx) => (
          <Animated.View key={idx} style={[styles.botMessage, { opacity: fadeAnim[idx] }]}>
            <Text style={styles.botText}>{msg}</Text>
          </Animated.View>
        ))}

        {typing && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>
              <Animated.Text
                style={{
                  transform: [{
                    translateY: avatarAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0, -2]
                    })
                  }]
                }}
              >
                💬
              </Animated.Text>{' '}
              SageBot est en train d’écrire...
            </Text>
          </View>
        )}

        {showBack && (
          <Animated.View style={styles.backContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>⬅️ Retour</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tape ta question ici..."
          placeholderTextColor="#999"
          editable={false}
        />
        <Text style={styles.disabledNote}>💬 Chat indisponible pour le moment</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.logo,
    marginTop: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0F7FA',
  },
  messages: {
    paddingBottom: 40,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 2,
  },
  botText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  inputContainer: {
    paddingVertical: 15,
    borderTopColor: '#DDD',
    borderTopWidth: 1,
  },
  input: {
    backgroundColor: '#ECECEC',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    fontSize: 16,
    color: '#999',
  },
  disabledNote: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
  },
  typingIndicator: {
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#EEE',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  typingText: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 14,
  },
  backContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: Colors.logo,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
