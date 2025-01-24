import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {RadioButton} from 'react-native-paper';
// import { RawButton } from 'react-native-gesture-handler';
const CheckOut = ({navigation, route}) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    creditCard: {cardNumber: '', expiryDate: '', cvv: ''},
    bankAccount: {accountNumber: '', routingNumber: ''},
    paypal: {paypalEmail: ''},
  });

  const handleDeliveryCheckout = () => {
    if (paymentMethod && deliveryMethod) {
      navigation.navigate('DeliveryCheckOut', {total: route.params.total});
    } else {
      alert('Please select payment and delivery methods.');
    }
  };

  const {total} = route.params;

  const PaymentDetailsModal = ({visible, onClose, paymentMethod, onSave}) => {
    const [details, setDetails] = useState(paymentDetails[paymentMethod] || {});

    const handleChange = (field, value) => {
      setDetails(prevDetails => ({
        ...prevDetails,
        [field]: value,
      }));
    };

    const handleSave = () => {
      if (
        (paymentMethod === 'creditcard' &&
          (!details.cardNumber || !details.expiryDate || !details.cvv)) ||
        (paymentMethod === 'bank' &&
          (!details.accountNumber || !details.routingNumber)) ||
        (paymentMethod === 'paypal' && !details.paypalEmail)
      ) {
        alert('Please fill in all required fields.');
        return;
        console.log;
      }
      console.log('Saving payment details:', paymentMethod, details);
      onSave(paymentMethod, details); // Save details to Firestore
      // alert(`${paymentMethod} details saved successfully.`);
      onClose(); // Close the modal
    };

    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}>
        <View style={styles.modaloverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{paymentMethod} Details</Text>
            {paymentMethod === 'creditcard' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Card Number"
                  value={details.cardNumber || ''}
                  onChangeText={value => handleChange('cardNumber', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Expiry Date"
                  value={details.expiryDate || ''}
                  onChangeText={value => handleChange('expiryDate', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="CVV"
                  value={details.cvv || ''}
                  onChangeText={value => handleChange('cvv', value)}
                />
              </>
            )}
            {paymentMethod === 'bank' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Account Number"
                  value={details.accountNumber || ''}
                  onChangeText={value => handleChange('accountNumber', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Routing Number"
                  value={details.routingNumber || ''}
                  onChangeText={value => handleChange('routingNumber', value)}
                />
              </>
            )}
            {paymentMethod === 'paypal' && (
              <TextInput
                style={styles.input}
                placeholder="PayPal Email"
                value={details.paypalEmail || ''}
                onChangeText={value => handleChange('paypalEmail', value)}
              />
            )}

            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
              <Text style={styles.buttontext}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const handlePaymentMethodChange = value => {
    setPaymentMethod(value);
    setShowModal(true); // Show modal when a payment method is selected
  };

  const handleSavePaymentDetails = (paymentMethod, details) => {
    if (!auth().currentUser) {
      alert('User not logged in. Please sign in first.');
      return;
    }

    const userId = auth().currentUser.uid; // Get the current user's ID
    const userRef = firestore()
      .collection('Users') // Access the 'Users' collection
      .doc(userId); // Locate the current user document
    // .collection('paymentMethods') // Subcollection for payment methods
    // .doc(paymentMethod); // Specific document for selected payment method

    // Save details to Firestore
    userRef
      .update({[`paymentMethods.${paymentMethod}`]: details,

      })

      // .set(details)
      .then(() => {
        console.log(`${paymentMethod} details saved successfully`);
        alert('Payment details saved successfully.');
        // color = '#000000';
      })
      .catch(error => {
        console.error('Error saving payment details:', error);
        alert('Failed to save payment details. Please try again.');
      });
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
        <Text style={styles.title}>Checkout</Text>
      </View>
      <ScrollView>
        <Text style={styles.bigpaymenttext}>Payment</Text>
        <View>
          <Text style={styles.containertext}>Payment method</Text>
          <RadioButton.Group
            onValueChange={handlePaymentMethodChange}
            value={paymentMethod}>
            <View style={styles.radiobtncontainer}>
              <View style={styles.radiobuttonview}>
                <RadioButton value="creditcard" />
                <Icon
                  name="creditcard"
                  color="#ffffff"
                  style={styles.creditcardicon}
                />
                <Text style={styles.radionbuttontext}>Credit card</Text>
              </View>
              <View style={styles.HorizontalLine} />
              <View style={styles.radiobuttonview}>
                <RadioButton value="bank" />
                <Icon2
                  name="bank"
                  color="#ffffff"
                  style={styles.bankaccounticon}
                />
                <Text style={styles.radionbuttontext}>Bank account</Text>
              </View>
              <View style={styles.HorizontalLine} />

              <View style={styles.radiobuttonview}>
                <RadioButton value="paypal" />
                <Icon2
                  name="paypal"
                  color="#ffffff"
                  style={styles.paypalicon}
                />

                <Text style={styles.radionbuttontext}> Paypal</Text>
              </View>
            </View>
          </RadioButton.Group>
          <PaymentDetailsModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            paymentMethod={paymentMethod}
            onSave={handleSavePaymentDetails}
          />
        </View>

        <View style={styles.deliverycontainer}>
          <Text style={styles.containertext}>Delivery method</Text>
          <RadioButton.Group
            onValueChange={value => setDeliveryMethod(value)}
            value={deliveryMethod}>
            <View style={styles.radiobtncontainer}>
              <View style={styles.radiobuttonview}>
                <RadioButton value="door" />
                <Icon1
                  name="delivery-dining"
                  color="#ffffff"
                  style={styles.dooedeliveryicon}
                />

                <Text style={styles.radionbuttontext}>Door delivery</Text>
              </View>
              <View style={styles.HorizontalLine} />
              <View style={styles.radiobuttonview}>
                <RadioButton value="pickup" />
                <Icon1
                  name="share-location"
                  color="#ffffff"
                  style={styles.pickupicon}
                />
                <Text style={styles.radionbuttontext}>Pick up</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        <View style={styles.totalcontainer}>
          <Text style={styles.totaltext}>Total</Text>
          <Text style={styles.totalamount}>{total}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.paymentbutton}
        onPress={handleDeliveryCheckout}>
        <Text style={styles.buttontext}>Proceed to payment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckOut;

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
  containertext: {
    marginHorizontal: 26,
    paddingHorizontal: 15,
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },

  buttontext: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bigpaymenttext: {
    fontWeight: 'bold',
    fontSize: 34,
    color: '#000000',
    margin: 26,
    padding: 15,
  },
  radiobtncontainer: {
    margin: 26,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  deliverycontainer: {
    // flex:4,
    // margin: 26,
    // padding: 15,
    // backgroundColor: '#ffffff',
    // borderRadius: 15,
  },
  paymentbutton: {
    backgroundColor: '#ff5723',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
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
  dooedeliveryicon: {
    backgroundColor: '#00bfff',
    padding: 5,
    margin: 7,
    borderRadius: 5,
  },
  pickupicon: {
    backgroundColor: '#ff00e2',
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
  totalcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,

    margin: 25,
  },
  totaltext: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
  },
  totalamount: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000000',
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
  modalContainer: {
    // flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5723',
    marginBottom: 10,
  },
  modaloverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    width: 280,
    elevation: 3,
  },
});
