import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const checkAuthentication = async () => {
      // Check if it's the first launch
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      if (!isFirstLaunch) {
        await AsyncStorage.setItem('isFirstLaunch', 'true');
        navigation.replace('SignUp'); // Navigate to SignUp on first launch
        return;
      }

      // Check user authentication status
      const unsubscribe = auth().onAuthStateChanged(user => {
        if (user) {
          if (auth().currentUser.emailVerified) {
            // Navigate to Home/TabNavigator if user is authenticated and email is verified
            navigation.replace('Tabnavigator');
          } else {
            // If email is not verified, navigate to SignIn with a warning
            navigation.replace('SignIn');
          }
        } else {
          // Navigate to SignIn if no user is authenticated
          navigation.replace('SignIn');
        }
      });

      // Clean up the auth subscription
      return () => unsubscribe();
    };

    checkAuthentication();
  }, [navigation]);

  return (
    <>
      <View style={styles.container}>
        <Animatable.Image
          animation="zoomInDown"
          duration={2000}
          source={require('../assets/logo.png')}
          style={styles.image}
        />
        {/* <Image source={require('../assets/logo.png')} style={styles.image} /> */}
        <Animatable.Text
          animation="zoomInUp"
          duration={2000}
          style={styles.tagline}>
          Fuel Your Cravings, Anytime, Anywhere!
        </Animatable.Text>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff5723',
    paddingBottom: 60,
    paddingLeft: 18,
  },
  image: {
    width: 300,
    height: 300,
  },
  tagline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
