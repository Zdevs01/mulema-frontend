import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  StatusBar,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/assets/fonts/color";
import { CustomButton } from "@/components/CustomButton";
import { ProgressBar } from "react-native-paper"; // si tu as react-native-paper installé

const WelcomeVideo = () => {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const videoRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [langue, setLangue] = useState(null);
  const [videoFinished, setVideoFinished] = useState(false);
  const [videoDéjàVue, setVideoDéjàVue] = useState(false);
  const [progress, setProgress] = useState(0); // Progression de la vidéo

  useEffect(() => {
    const fetchLangue = async () => {
      try {
        const res = await fetch("http://172.20.10.3:5000/api/languages");
        const data = await res.json();
        const langueChoisie = data.find((l) => l.id == id);
        setLangue(langueChoisie || null);
      } catch (error) {
        console.error("Erreur fetch langue :", error);
      }
    };
    if (id) fetchLangue();
  }, [id]);

  useEffect(() => {
    const checkSiVue = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;
        const res = await fetch(
          `http://172.20.10.3:5000/api/user/video-viewed/${userId}/${id}`
        );
        const data = await res.json();
        setVideoDéjàVue(data.viewed);
      } catch (error) {
        console.error("Erreur vérification vidéo vue:", error);
      }
    };
    if (id) checkSiVue();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (videoRef.current) videoRef.current.pauseAsync();
      };
    }, [])
  );

  const handleVideoEnd = async () => {
    setVideoFinished(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      await fetch(`http://172.20.10.3:5000/api/user/set-video-viewed/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ langueId: id }),
      });
    } catch (error) {
      console.error("Erreur mise à jour vidéo vue:", error);
    }
  };

  const handleNext = () => {
    if (id == 1) router.push("/home2");
    else if (id == 2) router.push("/home4");
    else if (id == 3) router.push("/home3");
    else router.push("/home2"); // fallback
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {langue?.video_intro && !videoDéjàVue && (
        <Video
          ref={videoRef}
          source={{ uri: String(langue.video_intro) }}
          style={[styles.video, { width, height }]}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={(status) => {
            if (!status.isLoaded) return;
            const { positionMillis, durationMillis, didJustFinish } = status;
            if (durationMillis && positionMillis) {
              setProgress(positionMillis / durationMillis);
            }
            if (didJustFinish && !videoFinished) {
              handleVideoEnd();
            }
          }}
          
        />
      )}

      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.top}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>
            🎧 Plonge dans l’univers de la langue :
          </Text>
          <Text style={styles.languageName}>
            🗣️ {langue?.nom || "Langue inconnue"}
          </Text>
        </View>

        {!langue ? (
          <ActivityIndicator size="large" color={Colors.logo} />
        ) : videoDéjàVue ? (
          <>
            <Text style={styles.welcomeBack}>
              👋 Bienvenue à nouveau dans l’univers de la langue {langue.nom} !
            </Text>
            <Animated.View style={[styles.buttonWrapper, { opacity: 1 }]}>
              <CustomButton
                title="➡️ Continuer"
                titleStyle={{ color: Colors.white }}
                pressStyle={styles.button}
                onPress={handleNext}
              />
            </Animated.View>
          </>
        ) : (
          <>
            {!langue.video_intro && (
              <Text style={styles.error}>🚫 Vidéo non disponible.</Text>
            )}
            {videoFinished && (
              <Animated.View style={[styles.buttonWrapper, { opacity: fadeAnim }]}>
                <CustomButton
                  title="➡️ Suivant"
                  titleStyle={{ color: Colors.white }}
                  pressStyle={styles.button}
                  onPress={handleNext}
                />
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
      <View style={styles.progressBarWrapper}>
  <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
</View>

    </View>
  );
};

export default WelcomeVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F2",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },
  overlay: {
    flexGrow: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  languageName: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.logo,
    marginVertical: 10,
  },
  welcomeBack: {
    marginTop: 40,
    fontSize: 18,
    color: "#444",
    textAlign: "center",
  },
  buttonWrapper: {
    marginTop: 30,
    width: "70%",
  },
  button: {
    backgroundColor: Colors.logo2,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 4,
    borderColor: Colors.logo,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
  },
  progressBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#e0e0e0",
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.logo2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  
});
