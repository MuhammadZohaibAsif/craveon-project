import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Iconleft from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Entypo';
import CartContext from './CartContext';
import Iconlocation from 'react-native-vector-icons/Entypo';

const OrderTracking = ({navigation}) => {
  const {orderTimestamp, getTotalCartItems} = useContext(CartContext);
  const [showMap, setShowMap] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const cartItemCount = getTotalCartItems();

  const restaurantLocation = {latitude: 33.651714, longitude: 73.0913};
  const userLocation = {latitude: 33.636512, longitude: 73.074677};

  useEffect(() => {
    if (orderTimestamp) {
      const ONE_MINUTE = 1 * 60 * 1000; 
      const currentTime = Date.now();
      setShowMap(currentTime - orderTimestamp < ONE_MINUTE);
    }
  }, [orderTimestamp]);

  useEffect(() => {
    if (orderTimestamp) {
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = orderTimestamp + 1 * 60 * 1000 - currentTime; 

        if (timeLeft > 0) {
          const minutes = Math.floor(timeLeft / 60000);
          const seconds = ((timeLeft % 60000) / 1000).toFixed(0);
          setRemainingTime(`${minutes}m ${seconds}s remaining`);
        } else {
          setRemainingTime('');
          setShowMap(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [orderTimestamp]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={() => navigation.goBack()}>
          <Iconleft name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Orders Tracking</Text>

      </View>

      {showMap ? (
        <View style={{flex: 1}}>
          {showMap && <Text style={styles.timerText}>{remainingTime}</Text>}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 33.651714,
              longitude: 73.0913,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker coordinate={restaurantLocation} title="Restaurant">
              <Icon name="shop" size={30} color="#ff5723" />
            </Marker>
            <Marker coordinate={userLocation} pinColor="black" />
            <Polyline
              coordinates={[restaurantLocation, userLocation]}
              strokeColor="red"
              strokeWidth={3}
            />
          </MapView>
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <Iconlocation
            name="location"
            size={90}
            color="#b8b7b4"
            style={styles.icon}
          />
          <Text style={styles.nocontentarea}>No orders yet</Text>
          <Text style={styles.messageText}>
            Please place an order from the home screen first to track it
          </Text>
        </View>
      )}
    </View>
  );
};

export default OrderTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 25,
  },
  map: {
    height: 700,
    width: '100%',
    marginTop: 20,
    margin: 10,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    height: 100,
    width: 90,
  },
  description: {
    width: 220,
    paddingHorizontal: 37,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  messageText: {
    width: 220,
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  nocontentarea: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  timerText: {
    position: 'absolute',
    top: 15,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    color: '#ff5723',
    fontWeight: 'bold',
    zIndex: 1, 
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 25,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 90,
    color: '#333',
  },
});
