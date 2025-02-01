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

import Iconmenu from 'react-native-vector-icons/Entypo';

import Icon2 from 'react-native-vector-icons/FontAwesome';

import Icon3 from 'react-native-vector-icons/Fontisto';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MyProfile = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth().currentUser.uid;
      const userDoc = await firestore().collection('Users').doc(userId).get();

      if (userDoc.exists) {
        const data = userDoc.data();
        setUserData(data);
        setEditedData(data);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const userId = auth().currentUser.uid;
    try {
      await firestore().collection('Users').doc(userId).update(editedData);
      setUserData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuIconContainer}
            onPress={() => navigation.toggleDrawer()}>
            <Iconmenu name="menu" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity
            style={styles.editiconcontainer}
            onPress={() => setIsEditing(true)}>
            <Icon2
              name="edit"
              size={20}
              color="#000000"
              style={styles.editicon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.parentbgccontainer}>
          <Icon3
            name="person"
            size={120}
            color="#ff5723"
            style={styles.personimage}
          />
        </View>
        <View style={styles.usercontainer}>
          <View style={styles.headingcontainer}>
            <Text style={styles.headingtext}>Name</Text>
            <Text style={styles.userinfotxt}>{userData.name || 'Name'}</Text>
          </View>

          <View style={styles.HorizontalLine}></View>
          <View style={styles.headingcontainer}>
            <Text style={styles.headingtext}>Email</Text>
            <Text style={styles.userinfotxt}>{userData.email || 'Email'}</Text>
          </View>
          <View style={styles.HorizontalLine}></View>

          <View style={styles.headingcontainer}>
            <Text style={styles.headingtext}>Phone</Text>
            <Text style={styles.userinfotxt}>
              {userData.mobileNumber || 'Phone'}
            </Text>
          </View>
          <View style={styles.HorizontalLine}></View>

          <View style={styles.headingcontainer}>
            <Text style={styles.headingtext}>Address</Text>
            <Text style={styles.userinfotxt}>
              {userData.address || 'Address'}
            </Text>
          </View>
          <View style={styles.HorizontalLine}></View>
        </View>
      </View>
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
    </>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconContainer: {
    position: 'absolute',
    left: -4.05,
    top: -1.5,
    paddingLeft: 25,
  },
  editiconcontainer: {
    position: 'absolute',
    right: -4.05,
    top: 4.5,
    paddingRight: 25,
  },
  title: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 90,
  },
  parentbgccontainer: {
    backgroundColor: '#ffffff',
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginTop: 34,
    elevation: 3,
    marginHorizontal: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderColor: '#ff5723',
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
  },

  personimage: {
    borderRadius: 10,
    marginHorizontal: 13,
    marginLeft: 20,
  },
  usercontainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 15,
    borderColor: '#ff5723',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    backgroundColor: '#ffffff',
    elevation: 1,
    marginHorizontal: 25,
    marginBottom: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  headingcontainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  headingtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff5723',
    marginBottom: 8,
  },
  userinfotxt: {
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#000000',
  },

  backbutton: {
    marginRight: 10,
  },

  profilecontainer: {
    flexDirection: 'column',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 6,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconscontainer: {
    flexDirection: 'row',
  },
  proinfocontainer: {},

  MarvisIghedosa: {
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },

  editicon: {},
  infromationcontaiber: {
    flexDirection: 'row',
    marginTop: 100,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: '80%',
    borderBottomColor: '#ff5723',
    borderBottomWidth: 1,
    marginVertical: 5,
    alignSelf: 'center',
    opacity: 0.6,
  },
  profiletexts: {
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
