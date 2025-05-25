// Classement ultra-animé version pro style Duolingo mobile moderne connecté au backend (XP = crevettes)
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  Easing,
  ActivityIndicator,
} from 'react-native';
import Colors from '@/assets/fonts/color';
import { useFonts } from 'expo-font';
import Nav from '@/components/Nav';
import { Audio } from 'expo-av';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Classement() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [user, setUser] = useState(null);
  const [crevettes, setCrevettes] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const podiumHeights = {
    1: useRef(new Animated.Value(0)).current,
    2: useRef(new Animated.Value(0)).current,
    3: useRef(new Animated.Value(0)).current,
  };
  const glowAnim = useRef(new Animated.Value(1)).current;
  const scrollFadeAnim = useRef(new Animated.Value(0)).current;
  const riseAnim = useRef(new Animated.Value(0)).current;
  const [prevLeaderboard, setPrevLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        if (!parsedUser?.id) return;
        setUser(parsedUser);

        const responseStats = await axios.get(`http://172.20.10.3:5000/api/user/stats/${parsedUser.id}`);
        setCrevettes(responseStats.data.crevettes);

        const responseLB = await axios.get(`http://172.20.10.3:5000/api/user/top20-with-user/${parsedUser.id}`);
        setPrevLeaderboard(leaderboard);
        setLeaderboard(responseLB.data);
      } catch (error) {
        console.error("Erreur récupération classement:", error);
      } finally {
        setLoading(false);
      }
    };

    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/level-win.mp3')
        );
        await sound.playAsync();
      } catch (e) {
        console.warn('Erreur audio :', e);
      }
    };

    playSound();
    fetchLeaderboard();

    Animated.parallel([
      Animated.stagger(300, [
        Animated.timing(podiumHeights[2], {
          toValue: 120,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
        Animated.timing(podiumHeights[1], {
          toValue: 180,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
        Animated.timing(podiumHeights[3], {
          toValue: 100,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.timing(scrollFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(riseAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  if (!fontsLoaded || loading) return <ActivityIndicator size="large" color={Colors.logo} style={{ flex: 1, justifyContent: 'center' }} />;

  const getBadge = (rank) => {
    switch (rank) {
      case 1: return require('@/assets/images/badge_gold.png');
      case 2: return require('@/assets/images/badge_silver.png');
      case 3: return require('@/assets/images/badge_bronze.png');
      default: return null;
    }
  };

  const podiumOrder = [2, 1, 3];

  const getRiseAnimation = (userId, i) => {
    const previousRank = prevLeaderboard.findIndex(u => u.id === userId);
    if (previousRank >= 0 && previousRank > i) {
      return {
        transform: [
          {
            translateY: riseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }
        ],
        opacity: scrollFadeAnim,
      };
    }
    return { opacity: scrollFadeAnim };
  };

  return (
    <>
      <Nav />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text>.</Text>
      <Text>.</Text>
      <Text>.</Text>
      <Text>.</Text>

        <Text style={styles.header}>🔥 Classement des Champions</Text>

        <Animated.View style={[styles.podiumContainer, { transform: [{ translateY: riseAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }] }]}>  
          {podiumOrder.map((displayRank, i) => {
            const user = leaderboard[displayRank - 1];
            if (!user) {
              return (
                <View key={i} style={styles.podiumItem}>
                  <View style={[styles.bar, { height: podiumHeights[displayRank], backgroundColor: '#eee' }]}>
                    <Text style={styles.name}>--</Text>
                    <Text style={styles.xp}>0 XP</Text>
                  </View>
                  <Text style={styles.rank}>#{displayRank}</Text>
                </View>
              );
            }

            return (
              <View key={user.id} style={styles.podiumItem}>
                <Animated.View style={[styles.bar, {
                  height: podiumHeights[displayRank],
                  backgroundColor: displayRank === 1 ? '#FFD700' : displayRank === 2 ? '#C0C0C0' : '#CD7F32',
                  transform: [{ scale: glowAnim }],
                }]}> 
                  <Image source={require('@/assets/images/thunder.png')} style={styles.flame} />
                  <Image source={getBadge(displayRank)} style={styles.badge} />
                  <Image source={require('@/assets/images/user.png')} style={styles.avatar} />
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{user.username || '---'}</Text>
                  <Text style={styles.xp}>{user.crevettes} XP</Text>
                </Animated.View>
                <Text style={styles.rank}>#{displayRank}</Text>
              </View>
            );
          })}
        </Animated.View>

        <Animated.View style={[styles.listContainer, { opacity: scrollFadeAnim }]}> 
          {leaderboard.slice(3).map((user, i) => (
            <Animated.View key={user.id} style={[styles.row, getRiseAnimation(user.id, i + 3)]}> 
              <View style={styles.left}>
                <Text style={styles.position}>#{i + 4}</Text>
                <Image source={require('@/assets/images/user.png')} style={styles.smallAvatar} />
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{user.username || '---'}</Text>
              </View>
              <Text style={styles.xpText}>{user.crevettes} XP</Text>
            </Animated.View>
          ))}
        </Animated.View>

        <View style={styles.meBox}>
          <Text style={styles.meTitle}>👤 Ton rang</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.meName}>{user?.username || 'Moi'}</Text>
          <Text style={styles.meXp}>{crevettes} XP</Text>
        </View>
      </ScrollView>
    </>
  );
}

// Styles restent inchangés
const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
    backgroundColor: '#fffdf6',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    color: Colors.logo,
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 280,
    marginBottom: 30,
  },
  podiumItem: {
    alignItems: 'center',
    width: 100,
  },
  bar: {
    borderRadius: 24,
    width: 90,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  flame: {
    width: 28,
    height: 28,
    position: 'absolute',
    top: -20,
    left: -12,
  },
  badge: {
    width: 28,
    height: 28,
    position: 'absolute',
    top: -20,
    right: -12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 13,
    fontFamily: 'SpaceMono-Regular',
    color: '#333',
    fontWeight: 'bold',
    maxWidth: 80,
    textAlign: 'center',
  },
  xp: {
    fontSize: 12,
    color: '#444',
  },
  rank: {
    fontSize: 16,
    color: Colors.logo,
    marginTop: 6,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 12,
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  position: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    color: Colors.logo,
  },
  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  xpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
  },
  meBox: {
    backgroundColor: '#f8f4e8',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
    borderWidth: 1,
    borderColor: '#e3d9c6',
  },
  meTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.logo,
    marginBottom: 4,
  },
  meName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    color: '#333',
  },
  meXp: {
    fontSize: 14,
    color: '#666',
  },
});
