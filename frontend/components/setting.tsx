import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
  ScrollView, Share, Animated, LayoutAnimation,
  Platform, UIManager, SafeAreaView,
} from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '@/assets/fonts/color.js';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const langues = [
  { label: 'Duala 🌊', value: 'duala', route: '/home2' },
  { label: 'Ghomala 🎶', value: 'ghomala', route: '/home3' },
  { label: 'Bassa 🌿', value: 'bassa', route: '/home4' },
];

export default function Setting() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [selectedLangue, setSelectedLangue] = useState('Duala');
  const [showLangues, setShowLangues] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [xpAnim] = useState(new Animated.Value(0.6));
  const [loadingLangue, setLoadingLangue] = useState(false);
  const sound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Erreur utilisateur:", error);
      }
    };
    fetchUser();
  }, []);

  const playSound = async () => {
    try {
      const { sound: loadedSound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/click2.mp3')
      );
      sound.current = loadedSound;
      await sound.current.replayAsync();
    } catch (error) {
      console.error('Erreur son :', error);
    }
  };

  const handleLangueChange = async (langueValue: string) => {
    const selected = langues.find(l => l.value === langueValue);
    if (!selected) return;

    setShowLangues(false);
    setSelectedLangue(langueValue);
    setLoadingLangue(true);
    await playSound();

    setTimeout(() => {
      setLoadingLangue(false);
      router.replace(selected.route);
    }, 2000); // temps d'animation
  };

  const getLangueLabel = (value: string) =>
    langues.find(lang => lang.value === value)?.label || 'Langue';

  const handleLogout = async () => {
    await AsyncStorage.clear();
    alert("Déconnexion réussie !");
    router.replace("/logout");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: '📱 Découvrez Mulema : apprenez les langues du Cameroun avec style 🌍✨',
      });
      await playSound();
    } catch (error) {
      console.error('Erreur partage :', error);
    }
  };

  const toggleAbout = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await playSound();
    setAboutVisible(!aboutVisible);
  };

  const toggleLangues = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await playSound();
    setShowLangues(!showLangues);
  };

  if (!fontsLoaded) return (
    <View style={styles.loadingFontContainer}>
      <Image source={require('@/assets/images/loading.gif')} style={styles.loadingGif} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* PROFIL */}
          <View style={styles.profileCard}>
            <Image source={require('@/assets/images/user.png')} style={styles.avatar} />
            <Text style={styles.username}>{user?.username || 'Chargement...'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileButtonText}>🎨 Personnaliser mon profil</Text>
            </TouchableOpacity>
          </View>

        

          {/* LANGUE */}
          <TouchableOpacity style={styles.settingCard} onPress={toggleLangues}>
            <View style={styles.settingRow}>
              <Icon name="language" size={20} color={Colors.black} />
              <Text style={styles.settingLabel}>Changer de langue</Text>
            </View>
            <Text style={styles.langueActuelle}>{getLangueLabel(selectedLangue)}</Text>
          </TouchableOpacity>

          {showLangues && (
            <View style={styles.langueList}>
              {langues.map((langue) => (
                <TouchableOpacity
                  key={langue.value}
                  onPress={() => handleLangueChange(langue.value)}
                  style={styles.langueOption}
                >
                  <Text style={styles.langueOptionText}>{langue.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* AUTRES OPTIONS */}
          <TouchableOpacity style={styles.settingCard} onPress={() => { router.push("/chat"); playSound(); }}>
            <View style={styles.settingRow}>
              <Icon name="comments" size={20} color={Colors.black} />
              <Text style={styles.settingLabel}>Accéder au chat 💬</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} onPress={handleShare}>
            <View style={styles.settingRow}>
              <Icon name="share-alt" size={20} color={Colors.black} />
              <Text style={styles.settingLabel}>Partager l’application 📤</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} onPress={toggleAbout}>
            <View style={styles.settingRow}>
              <Icon name="info-circle" size={20} color={Colors.black} />
              <Text style={styles.settingLabel}>À propos de Mulema 📘</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpButton} onPress={() => { router.push("/aide"); playSound(); }}>
            <Text style={styles.helpText}>🆘 Besoin d’aide ?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => { handleLogout(); playSound(); }}>
            <Text style={styles.logoutText}>🚪 Déconnexion</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* À propos */}
        {aboutVisible && (
          <View style={styles.bottomPanel}>
            <Text style={styles.aboutText}>
              Mulema est une plateforme éducative pour apprendre les langues du Cameroun. 🇨🇲🌍
              Reconnecte-toi à tes racines avec style et fierté !
            </Text>
            <TouchableOpacity
              onPress={toggleAbout}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Fermer ✖️</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Animation de chargement personnalisée */}
        {loadingLangue && (
          <View style={styles.loadingOverlay}>
            <Image
              source={require('@/assets/images/loading.gif')}
              style={styles.loadingGif}
              resizeMode="contain"
            />
            <Text style={styles.loadingText}>Chargement de la nouvelle langue... ⏳</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
  container: { flex: 1, position: 'relative' },
  scrollContainer: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 160 },
  profileCard: {
    alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20,
    borderRadius: 25, marginBottom: 20, shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10, backgroundColor: Colors.gris2 },
  username: { fontSize: 20, fontWeight: 'bold', color: Colors.black },
  email: { fontSize: 14, color: Colors.gris4, marginBottom: 10 },
  profileButton: {
    backgroundColor: '#FF4C4C', paddingVertical: 8, paddingHorizontal: 25,
    borderRadius: 25,
  },
  profileButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  xpCard: {
    backgroundColor: '#e1f2f1', padding: 20, borderRadius: 25,
    marginBottom: 20, alignItems: 'center',
  },
  levelText: { fontSize: 18, fontWeight: 'bold', color: '#1C1B1BFF', marginBottom: 8 },
  progressContainer: {
    height: 15, width: '100%', backgroundColor: '#FF4C4C44',
    borderRadius: 20, overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%', backgroundColor: '#FF4C4C',
  },
  xpText: { fontSize: 12, color: Colors.gris3 },

  settingCard: {
    backgroundColor: '#fff', borderRadius: 15,
    paddingVertical: 18, paddingHorizontal: 20,
    marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', shadowColor: '#000',
    shadowOpacity: 0.03, shadowRadius: 5, elevation: 1,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 15, color: Colors.black, fontWeight: '600' },
  langueActuelle: { fontWeight: 'bold', fontSize: 15, color: Colors.black },

  langueList: {
    backgroundColor: '#fff', borderRadius: 15, paddingVertical: 10,
    marginBottom: 20, shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  langueOption: { paddingVertical: 10, paddingHorizontal: 20 },
  langueOptionText: { fontSize: 16, color: '#08860CFF' },

  helpButton: {
    marginTop: 10, marginBottom: 40,
    alignSelf: 'center',
    paddingVertical: 10, paddingHorizontal: 30,
    backgroundColor: '#FF4C4C',
    borderRadius: 30,
  },
  helpText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  logoutButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  bottomPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#e1f2f1', padding: 20,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  aboutText: { fontSize: 16, color: '#151414FF', marginBottom: 12, textAlign: 'center' },
  closeButton: {
    alignSelf: 'center', paddingVertical: 8,
    paddingHorizontal: 20, backgroundColor: '#C10808FF',
    borderRadius: 20,
  },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },

  // LOADING ANIMATION OVERLAY
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  },
  loadingGif: { width: 120, height: 120, marginBottom: 20 },
  loadingText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  loadingFontContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4F8',
  },
});
