import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    if (!name || !address || !mobileNumber || !email || !password) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const userId = userCredential.user.uid;

      await firestore()
        .collection('Users')
        .doc(userId)
        .set({
          name: name,
          address: address,
          mobileNumber: mobileNumber,
          email: email,
          history: [],
          favorites: [],
          paymentMethods: {
            creditcard: {},
            bank: {},
            paypal: {},
          }, 
        });

      navigation.navigate('SignIn');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('The email address is not valid.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password should be at least 6 characters.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };
  return (
    <View style={styles.conatiner}>
      <View style={styles.conatinersecond}>
        <Text style={styles.signup}>Sign Up</Text>
      </View>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.accountbtn} onPress={handleSignUp}>
        <Text style={styles.accounttext}>Create Account</Text>
      </TouchableOpacity>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <View style={styles.signinnavigation}>
        <Text>Do you have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signinText}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

export const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
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
  signup: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ff5723',
    marginBottom: 40,
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
});
