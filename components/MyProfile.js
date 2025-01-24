import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import Icon from 'react-native-vector-icons/AntDesign';
// // import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';

import Icon3 from 'react-native-vector-icons/Fontisto';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {RadioButton} from 'react-native-paper';

const MyProfile = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth().currentUser.uid; // Current User UID
      const userDoc = await firestore().collection('Users').doc(userId).get();

      if (userDoc.exists) {
        const data = userDoc.data();
        setUserData(data); // State update
        setEditedData(data); // Edit ke liye initial data
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const userId = auth().currentUser.uid;
    try {
      await firestore().collection('Users').doc(userId).update(editedData);
      setUserData(editedData); // UI update
      setIsEditing(false); // Modal close
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="left"
            size={30}
            color="#000000"
            style={styles.backbutton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
      </View>
      <View>
        <Text style={styles.containertext}>Information</Text>
        <View style={styles.profilecontainer}>
          <Icon3
            name="person"
            size={35}
            color="#ff5723"
            style={styles.personimage}
          />
          <View style={styles.proinfocontainer}>
            <Text style={styles.MarvisIghedosa}>{userData.name || 'Name'}</Text>
            <Text>{userData.email || 'Email'}</Text>
            <Text style={styles.profiletexts}>
              {userData.address || 'Address'}
            </Text>
            <Text>{userData.mobileNumber || 'Phone'}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Icon2
              name="edit"
              size={20}
              color="#000000"
              style={styles.editicon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.containertext}>Payment method</Text>
        <RadioButton.Group>
          <View style={styles.radiobtncontainer}>
            <View style={styles.radiobuttonview}>
              <RadioButton value="credit" />
              <Icon
                name="creditcard"
                color="#ffffff"
                style={styles.creditcardicon}
              />
              <Text style={styles.radionbuttontext}>Credit card</Text>
            </View>
            <View style={styles.HorizontalLine} />
            <View style={styles.radiobuttonview}>
              <RadioButton value="credit" />
              <Icon2
                name="bank"
                color="#ffffff"
                style={styles.bankaccounticon}
              />
              <Text style={styles.radionbuttontext}>Bank account</Text>
            </View>
            <View style={styles.HorizontalLine} />

            <View style={styles.radiobuttonview}>
              <RadioButton value="credit" />
              <Icon2 name="paypal" color="#ffffff" style={styles.paypalicon} />

              <Text style={styles.radionbuttontext}> Paypal</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <View></View>
      <View></View>
      <TouchableOpacity style={styles.paymentbutton}>
        <Text style={styles.buttontext}>Updated</Text>
      </TouchableOpacity>

      <Modal visible={isEditing} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedData.name || ''}
              onChangeText={text => setEditedData({...editedData, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={editedData.address || ''}
              onChangeText={text =>
                setEditedData({...editedData, address: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={editedData.mobileNumber || ''}
              keyboardType="numeric"
              onChangeText={text =>
                setEditedData({...editedData, mobileNumber: text})
              }
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  backbutton: {
    marginRight: 10,
  },
  title: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 90,
  },

  profilecontainer: {
    flexDirection: 'row',
    // width: 300,
    paddingVertical:12,
    paddingRight:15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 6,
    marginVertical: 15,
    elevation: 5,
    // justifyContent:"center",
  },
  proinfocontainer: {
    width: 195,
    justifyContent: 'center',
    flex: 1,
  },
  personimage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 13,
    marginLeft: 20,
    marginTop: 22,
  },
  MarvisIghedosa: {
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },

  editicon: {
    marginRight: 10,
    marginTop: 23,
  },
  containertext: {
    marginHorizontal: 6,
    paddingHorizontal: 10,
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radiobtncontainer: {
    margin: 6,

    padding: 15,
    marginVertical: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 3,
  },
  radiobuttonview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditcardicon: {
    backgroundColor: '#F47B0A',
    padding: 5,
    margin: 7,
    borderRadius: 5,
  },
  bankaccounticon: {
    backgroundColor: '#EB4796',
    padding: 5,
    margin: 7,
    borderRadius: 5,
  },
  paypalicon: {
    backgroundColor: '#0038FF',
    padding: 5,
    margin: 7,
    borderRadius: 5,
  },

  radionbuttontext: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },

  HorizontalLine: {
    width: '68%',
    borderBottomColor: 'black', // Line color
    borderBottomWidth: 1, // Line thickness
    marginVertical: 7,
    alignSelf: 'center',
  },
  profiletexts: {
    // textTransform: 'capitalize',
    textAlign: 'left',
  },

  buttontext: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  paymentbutton: {
    backgroundColor: '#ff5723',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5723',
    marginBottom: 10,
  },
  input: {
    margin: 6,
    height: 50,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    borderColor: '#F6FAFF',
    backgroundColor: '#eeeee4',
    width: 280,
    elevation: 3,
  },
  modalButton: {
    backgroundColor: '#ff5723',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 15,
    margin: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '500',
  },
});
