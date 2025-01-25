import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  Alert,
  Modal,
  Button,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Iconmenu from 'react-native-vector-icons/Entypo';

import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const History = ({navigation}) => {
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = auth().currentUser.uid; // Get current user ID
        const userDoc = await firestore().collection('Users').doc(userId).get();

        if (userDoc.exists) {
          const userHistory = userDoc.data().history || [];
          setHistory(userHistory);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        Alert.alert(
          'Error',
          'Unable to fetch history. Please try again later.',
        );
      }
    };

    fetchHistory();
  }, []);

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

      // Save to Firebase
      await firestore()
        .collection('Users')
        .doc(userId)
        .update({
          history: firestore.FieldValue.arrayUnion(orderData),
        });

      // Clear cart in CartContext
      updateCart([]); // Reset cart items

      // Navigate to History and reset stack
      navigation.reset({
        index: 0,
        routes: [{name: 'History'}],
      });

      Alert.alert('Success', 'Order completed and added to history.');
    } catch (error) {
      console.error('Error updating order history:', error);
      Alert.alert('Error', 'Failed to complete the order. Please try again.');
    }
  };

  const handleDeleteOrder = async orderNumber => {
    try {
      const userId = auth().currentUser.uid;
      const updatedHistory = history.filter(
        item => item.orderNumber !== orderNumber,
      );

      // Update Firestore
      await firestore().collection('Users').doc(userId).update({
        history: updatedHistory,
      });

      setHistory(updatedHistory);
      Alert.alert('Success', `Order# ${orderNumber} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting order:', error);
      Alert.alert('Error', 'Unable to delete order. Please try again.');
    }
  };

  const handleClearHistory = async () => {
    try {
      const userId = auth().currentUser.uid;

      // Update Firestore
      await firestore().collection('Users').doc(userId).update({
        history: [],
      });

      setHistory([]);
      Alert.alert('Success', 'History cleared successfully.');
    } catch (error) {
      console.error('Error clearing history:', error);
      Alert.alert('Error', 'Unable to clear history. Please try again.');
    }
  };

  const handleOrderPress = order => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setModalVisible(false);
  };

  const renderOrder = ({item}) => (
    <View style={styles.orderCard1}>
      <TouchableOpacity
        onPress={() => handleOrderPress(item)}
        style={styles.orderCard2}>
        <View style={styles.orderkasubCard}>
          <Text style={styles.ordernumber}>Order#: {item.orderNumber}</Text>
        </View>
        <View style={styles.orderkasubCard1}>
          <Text style={styles.orderbill}>Total: RS-/ {item.total}</Text>
          <View>
            <Text style={styles.orderText}>Date: {item.date}</Text>
            <Text style={styles.orderText}>Time: {item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            'Delete Order',
            `Are you sure you want to delete this Order# ${item.orderNumber}?`,
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Delete',
                onPress: () => handleDeleteOrder(item.orderNumber),
              },
            ],
          )
        }>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={() => navigation.toggleDrawer()}>
          <Iconmenu name="menu" size={30} color="#333" />
        </TouchableOpacity>
        {/* <Text style={styles.backbutton}>{'<'}</Text> */}
        <Text style={styles.title}>History</Text>

        {history.length > 0 && (
          <TouchableOpacity
          style={styles.trashiconcontainer}
            onPress={() =>
              Alert.alert(
                'Clear History',
                'Are you sure you want to clear all history?',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {text: 'Clear', onPress: handleClearHistory},
                ],
              )
            }>
            <Icon1 name="trash" size={20} color="#ff5723" />
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.content}>
          <Image
            source={require('../assets/calender.png')}
            style={styles.icon}
          />
          <Text style={styles.nohistorytext}>No history yet</Text>
          <Text style={styles.description}>
            Hit the orange button down below to Create an order
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderOrder}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>Products:</Text>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, index) => (
                    <View key={index} style={styles.productsview}>
                      <Text style={styles.modalText}>{item.name}</Text>
                      <Text>{item.quantity}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.modalText}>
                    No items found in this order.
                  </Text>
                )}
              </>
            )}
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 25,
    backgroundColor: '##f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 19,
    marginBottom: 40,
    // backgroundColor:"green"
  },
  menuIconContainer: {
    position: 'absolute', // To make it left-aligned
    left: -4.05,
    top: -1.5,
    // paddingRight: 10,
    // paddingBottom: 25,
  },
  trashiconcontainer:{
    position: 'absolute', // To make it left-aligned
    right: -4.05,
    top: 4,
    // paddingRight: 10,
    // paddingBottom: 25,
  },
  backbutton: {
    color: '#333',
    marginRight: 10,
    fontSize: 24,
  },
  title: {
    color: '#333',
    paddingHorizontal: 90,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom:2
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    height: 100,
    width: 90,
    marginBottom: 20,
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
  buttontext: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#FF5733',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
  },
  orderCard2: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    // elevation: 2,
  },
  orderCard1: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  orderkasubCard: {
    marginBottom: 12,
  },
  orderkasubCard1: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ordernumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5723',
  },
  orderbill: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff5723',
    padding: 10,
    borderRadius: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#ff5723',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
  },
  totalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#ff5723',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  productsview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
