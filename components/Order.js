import {
  Image,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import React, {useContext, useState} from 'react';
import CartContext from './CartContext';
import Icon from 'react-native-vector-icons/Fontisto';
import Iconleft from 'react-native-vector-icons/Entypo';
import Iconshoping from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';

const Order = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showContinueOrderButton, setShowContinueOrderButton] = useState(false);
  const {
    orderDetails,
    updateCart,
    clearOrderDetails,
    getTotalCartItems,
    orderTimestamp,
    setOrderTime,
  } = useContext(CartContext);

  const cartItemCount = getTotalCartItems();

  const orderNumber = orderDetails?.orderNumber;
  const total = orderDetails?.total;
  const date = orderDetails?.date;
  const time = orderDetails?.time;
  const orderedItems = orderDetails?.items || [];

  const handleHistory = async () => {
    if (orderedItems.length === 0) {
      Alert.alert('No Orders', 'There are no orders to complete.');
      return;
    }

    try {
      const userId = auth().currentUser.uid;

      const orderData = {
        orderNumber: orderNumber || 'Unknown',
        total: total || 0,
        date: date || new Date().toLocaleDateString(),
        time: time || new Date().toLocaleTimeString(),
        items: orderedItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
        })),
      };

      await firestore()
        .collection('Users')
        .doc(userId)
        .update({
          history: firestore.FieldValue.arrayUnion(orderData),
        });

      updateCart([]);
      clearOrderDetails();
      setOrderTime(Date.now());
      setIsModalVisible(true);

      setTimeout(() => {
        setIsModalVisible(false);

        setShowContinueOrderButton(true);
      }, 3000);
    } catch (error) {
      console.error('Error updating order history:', error);
      Alert.alert('Error', 'Failed to complete the order. Please try again.');
    }
  };

  const handleContinueOrder = () => {
    navigation.navigate('DrawerNavigator', {
      screen: 'TabNavigator',
      params: {screen: 'Home'},
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={handleContinueOrder}>
          <Iconleft name="chevron-left" size={30} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Orders</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartContainer}>
          <Iconshoping name="shoppingcart" size={28} color="#333" />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {orderedItems.length === 0 ? (
        <View style={styles.content}>
          <Icon
            name="shopping-bag-1"
            size={90}
            color="#b8b7b4"
            style={styles.icon}
          />
          <Text style={styles.nocontentarea}>No orders yet</Text>
          <Text style={styles.description}>
            Hit the "Home" icon down below to Create an order
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.topcontainer}>
            <Text style={styles.ordernumber}>Order#: {orderNumber}</Text>
            <Text style={styles.totalbill}>RS-/ {total}</Text>
          </View>
          <View style={styles.previousOrderContainer}>
            <View style={styles.colorcontainer}>
              <ScrollView>
                {orderedItems.map((item, index) => (
                  <View key={index} style={styles.itemsContainer}>
                    <Image source={{uri: item.image}} style={styles.image} />
                    <View style={styles.detailscontainer}>
                      <Text style={styles.productname}>{item.name}</Text>
                      <Text>Quantity : {item.quantity}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </>
      )}
      {orderedItems.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={handleHistory}>
          <Text style={styles.buttontext}>Complete order</Text>
        </TouchableOpacity>
      )}
      {showContinueOrderButton && (
        <TouchableOpacity style={styles.button} onPress={handleContinueOrder}>
          <Text style={styles.buttontext}>Continue Ordering</Text>
        </TouchableOpacity>
      )}

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../assets/success.json')}
              autoPlay
              loop={false}
              style={styles.lottieAnimation}
            />
          </View>
          <Text style={styles.modalText}>Order Completed!</Text>
        </View>
      </Modal>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  colorcontainer: {
    marginBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',

    padding: 25,
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
  },
  cartContainer: {
    position: 'absolute',
    right: -5.5,
    top: -0.5,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#ff5723',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  backbutton: {
    fontSize: 24,
    marginRight: 10,
    color: '#333',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 90,
    color: '#333',
  },

  content: {
    marginTop: 240,
    marginBottom: 240,
    alignItems: 'center',
  },
  icon: {
    height: 100,
    width: 90,
  },
  nohistorytext: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    width: 220,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  nocontentarea: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#FF5733',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
  },
  buttontext: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },

  previousOrderContainer: {
    flex: 1,
  },

  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    margin: 12,
  },
  detailscontainer: {
    padding: 5,
  },

  productname: {
    fontSize: 17,
    fontWeight: '500',
  },
  duration: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 14,
    fontWeight: '400',
    marginVertical: 4,
    paddingHorizontal: 2,
  },
  time: {
    fontSize: 14,
    fontWeight: '400',
    marginVertical: 4,
    paddingHorizontal: 3,
  },
  totalbill: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  ordernumber: {
    color: '#ff5723',
    fontSize: 20,
    fontWeight: 'bold',
  },
  topcontainer: {
    flexDirection: 'column',
    marginTop: 30,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lottieContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  modalText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
});
