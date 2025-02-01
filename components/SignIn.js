import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

const SignIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );

      const userId = userCredential.user.uid;

      const userDoc = await firestore().collection('Users').doc(userId).get();
      if (userDoc.exists) {
      }

      navigation.replace('DrawerNavigator');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('The email address is not valid.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.conatiner}>
      <View style={styles.conatinersecond}>
        <Text style={styles.signup}>Sign In</Text>
      </View>

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.email}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.email}
        importantForAutofill="yes"
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#ff5723" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.accountbtn} onPress={handleSignIn}>
          <Text style={styles.accounttext}>Sign In</Text>
        </TouchableOpacity>
      )}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <View style={styles.signinnavigation}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signinText}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signup: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ff5723',
    marginBottom: 40,
  },
  email: {
    margin: 6,
    height: 50,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    borderColor: '#F6FAFF',
    backgroundColor: '#eeeee4',
    width: 330,
    elevation: 3,
  },
  accountbtn: {
    backgroundColor: '#ff5723',
    padding: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20,
    width: 330,
    elevation: 6,
  },
  accounttext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
  },
  signinnavigation: {
    flexDirection: 'row',
    marginTop: 18,
    alignItems: 'center',
  },
  signinText: {
    color: '#ff5723',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  loader: {
    marginTop: 20,
  },
});
