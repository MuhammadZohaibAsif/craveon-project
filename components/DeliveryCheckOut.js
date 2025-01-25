import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Snackbar} from 'react-native-paper';
import CartContext from './CartContext';

import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {RadioButton} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

const DeliveryCheckOut = ({navigation, route}) => {
  const {setOrderData} = useContext(CartContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // const [snackbarVisible, setSnackbarVisible] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  const {total} = route.params;

  const generateOrderNumber = () => Math.floor(Math.random() * 1000000);

  const handleOrders = () => {
    if (name && address && phone) {
      const orderNumber = generateOrderNumber();

      setLoading(true);

      setOrderData(orderNumber, total);

      setTimeout(() => {
        setLoading(false); // Stop loader after some delay (simulating a request)
        navigation.navigate('Order');
      }, 2000);
    } else {
      alert('Please fill in all the fields');
    }
  };

  return (
    <>
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
          <Text style={styles.title}>Checkout</Text>
        </View>

        <Text style={styles.bigdeliverybtn}>Delivery</Text>
        <View style={styles.addresscontainer}>
          <View style={styles.changecontainer}>
            <Text style={styles.addressdetails}>Address details</Text>
            <TouchableOpacity>
              <Text style={styles.changebtn}>change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressdetailscontainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter Name"
              value={name}
              onChangeText={text => setName(text)}
            />
            <View style={styles.horizontalline}></View>

            <TextInput
              style={styles.inputField}
              placeholder="Enter Address"
              value={address}
              onChangeText={text => setAddress(text)}
            />
            <View style={styles.horizontalline}></View>

            <TextInput
              style={styles.inputField}
              placeholder="Enter Phone Number"
              value={phone}
              onChangeText={text => setPhone(text)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.totalcontainer}>
          <Text style={styles.totaltext}>Total</Text>
          <Text style={styles.totalamount}>{total}</Text>
        </View>

        {loading ? ( // Show loader when loading is true
          <ActivityIndicator size="large" color="#ff5723" />
        ) : (
          <TouchableOpacity style={styles.paymentbtn} onPress={handleOrders}>
            <Text style={styles.paymentbtntext}>Proceed to payment</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000} // Duration of Snackbar visibility
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
        }}
        style={styles.snackbar}>
        {snackbarMessage}
      </Snackbar> */}
    </>
  );
};

export default DeliveryCheckOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backbutton: {
    marginRight: 10,
  },
  title: {
    paddingHorizontal: 90,
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  bigdeliverybtn: {
    fontSize: 30,
    color: '#000000',
    fontWeight: 'bold',
    paddingHorizontal: 16,
    // marginHorizontal: 15,
    marginVertical: 15,
  },
  changecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changebtn: {
    color: '#F47B0A',
    fontSize: 15,
  },

  addresscontainer: {
    marginHorizontal: 10,
  },
  addressdetails: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 15,
    paddingHorizontal: 7,
  },
  addressdetailscontainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 3,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  MarvisKparobo: {
    color: '#000000',
    fontWeight: '500',
    padding: 7,
    fontSize: 15,
    marginVertical: 5,
  },
  location: {
    color: '#000000',
    width: '85%',
    fontSize: 14,
    fontWeight: '500',
    padding: 6,
    margin: 1,
    marginVertical: 5,
  },
  mobileno: {
    color: '#000000',
    fontWeight: '500',

    fontSize: 15,
    padding: 6,
    marginVertical: 5,
    margin: 1,
  },
  deliverymethod: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 18,
    paddingVertical: 14,
    paddingHorizontal: 7,
  },
  deliverydetailscontainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 3,
  },
  ddradiobtn: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 13,
  },
  ddicon: {
    backgroundColor: '#00bfff',
    margin: 7,
    padding: 5,
    borderRadius: 5,
  },
  ddtext: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '600',
  },

  pupicon: {
    backgroundColor: '#ff00e2',
    margin: 7,
    padding: 5,
    borderRadius: 5,
  },
  pupradiobtn: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 13,
  },
  horizontalline: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    width: '85%',
    marginLeft: 7,
  },
  radioHR: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    width: '68%',
    alignSelf: 'center',
  },
  totalcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    margin: 25,
  },
  totaltext: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  totalamount: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
  },
  paymentbtn: {
    backgroundColor: '#ff5723',
    alignItems: 'center',
    borderRadius: 30,
    padding: 15,
  },
  paymentbtntext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  inputField: {
    height: 40,
    marginVertical: 8,
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  snackbar: {
    borderRadius: 10, // Optional: rounded corners for the Snackbar
  },
});

{
  /* <View style={styles.addresscontainer}>
        <Text style={styles.deliverymethod}>Delivery method</Text>
        <View style={styles.deliverydetailscontainer}>
          <View style={styles.ddradiobtn}>
            <RadioButton value="door delivery" />
            <Icons
              name="delivery-dining"
              color="#ffffff"
              style={styles.ddicon}
            />
            <Text style={styles.ddtext}>Door delivery</Text>
          </View>
          <View style={styles.radioHR}></View>
          <View style={styles.pupradiobtn}>
            <RadioButton value="pick up" />
            <Icons
              name="share-location"
              color="#ffffff"
              style={styles.pupicon}
            />
            <Text style={styles.ddtext}>Pick up</Text>
          </View>
        </View>
      </View> */
}
