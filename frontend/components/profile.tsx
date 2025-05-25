import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, Image,
  TouchableOpacity, ActivityIndicator, ScrollView
} from 'react-native';
import Colors from '@/assets/fonts/color.js';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Nav from '@/components/nav2';

const Profil = () => {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary || '#0000ff'} />
        <Text style={{ marginTop: 10 }}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.zprofil}>
          <View style={styles.pic}>
            <View style={styles.pica}>
              <Image source={require('@/assets/images/user.png')} style={styles.img} />
            </View>
            <TouchableOpacity style={styles.pen}>
              <Image source={require('@/assets/images/pen.png')} style={styles.imgs} />
            </TouchableOpacity>
          </View>
          <View style={styles.tex}>
            <Text style={styles.text1}>{user?.username}</Text>
            <Text style={styles.text2}>
              Membre depuis le {user?.date_inscription || 'Inconnue'}
            </Text>
          </View>
        </View>

        {/* Section Follower */}
        <View style={styles.follow}>
          {[...Array(3)].map((_, i) => (
            <View style={styles.counttext} key={i}>
              <Text style={styles.text1}>887 K</Text>
              <Text style={styles.text2}>Follower</Text>
            </View>
          ))}
        </View>

        {/* Boutons */}
        <View style={styles.stat}>
          <View style={styles.group}>
            <TouchableOpacity style={styles.mod}>
              <View style={styles.imgt}>
                <Image
                  source={require('@/assets/images/pen.png')}
                  style={styles.img}
                />
              </View>
              <Text style={styles.text3}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sms}>
              <View style={styles.imgt}>
                <Image
                  source={require('@/assets/images/msg.png')}
                  style={styles.img}
                />
              </View>
              <Text style={styles.text4}>Messages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.stat}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.text1}>Vos Statistiques</Text>
            <View style={styles.uml}>
              <Image
                source={require('@/assets/images/stat.png')}
                style={styles.imgX}
              />
            </View>
          </View>

          <View style={styles.group}>
            <View style={styles.bx}>
              <View style={styles.imgh}>
                <Image
                  source={require('@/assets/images/water.png')}
                  style={styles.img}
                />
              </View>
              <View>
                <Text style={styles.text1}>256</Text>
                <Text style={styles.text2}>Challenges</Text>
              </View>
            </View>

            <View style={styles.bx}>
              <View style={styles.imgh}>
                <Image
                  source={require('@/assets/images/book.png')}
                  style={styles.img}
                />
              </View>
              <View>
                <Text style={styles.text1}>256</Text>
                <Text style={styles.text2}>Leçons terminées</Text>
              </View>
            </View>
          </View>

          <View style={styles.group}>
            <View style={styles.bx}>
              <View style={styles.imgh}>
                <Image
                  source={require('@/assets/images/thunder.png')}
                  style={styles.img}
                />
              </View>
              <View>
                <Text style={styles.text1}>256</Text>
                <Text style={styles.text2}>Total XP</Text>
              </View>
            </View>

            <View style={styles.bx}>
              <View style={styles.imgh}>
                <Image
                  source={require('@/assets/images/cible.png')}
                  style={styles.img}
                />
              </View>
              <View>
                <Text style={styles.text1}>256</Text>
                <Text style={styles.text2}>Challenge</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Nav />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  zprofil: {
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  pic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pica: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gris2,
    borderColor: Colors.gris,
    borderWidth: 2,
    overflow: 'hidden',
  },
  pen: {
    width: 30,
    height: 30,
    backgroundColor: Colors.logo,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
    marginTop: 40,
  },
  tex: {
    alignItems: 'center',
    gap: 6,
  },
  text1: {
    fontFamily: Colors.font,
    fontSize: Colors.tsize,
    color: Colors.black,
    fontWeight: '600',
  },
  text2: {
    color: Colors.black,
    opacity: 0.5,
    textAlign: 'center',
    fontSize: 11,
  },
  text3: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  text4: {
    color: Colors.logo,
    fontSize: 12,
    fontWeight: 'bold',
  },
  follow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  counttext: {
    alignItems: 'center',
  },
  stat: {
    marginTop: 20,
    gap: 20,
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  mod: {
    flexDirection: 'row',
    backgroundColor: Colors.logo,
    borderRadius: Colors.radius2,
    height: 50,
    padding: Colors.padding,
    width: '49%',
    alignItems: 'center',
    gap: 10,
  },
  sms: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderColor: Colors.logo,
    borderWidth: 2,
    borderRadius: Colors.radius2,
    height: 50,
    padding: Colors.padding,
    width: '49%',
    alignItems: 'center',
    gap: 10,
  },
  bx: {
    flexDirection: 'row',
    borderColor: Colors.gris,
    borderWidth: 2,
    borderRadius: Colors.radius2,
    padding: Colors.padding,
    width: '49%',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white,
  },
  imgh: {
    width: 30,
    height: 30,
  },
  imgt: {
    width: 20,
    height: 20,
  },
  imgX: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imgs: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  uml: {
    marginLeft: 6,
  },          
});

export default Profil;
