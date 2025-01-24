import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import CartContext from './CartContext';
import {Snackbar} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProductDetails = ({navigation, route}) => {
  const [snackbarVisible, setsnakebarVisible] = useState(false);
  const [snakebarMessage, setsnakebarMessage] = useState('');

  const {name, price, imageName} = route.params;

  const {addToCart, toggleFavorite, isFavorite} = useContext(CartContext);

  const handleToggleFavorite = () => {
    const isFav = isFavorite(name); // Check current favorite state
    toggleFavorite({name, price, imageName}); // Toggle favorite status
    
    if (isFav) {
      setsnakebarMessage(`${name} removed from favorites`);
    } else {
      setsnakebarMessage(`${name} added to favorites`);
    }
  
    setsnakebarVisible(true); // Show snackbar
  };

  const handleAddToCart = () => {
    addToCart(name, price, imageName);
    // navigation.navigate('Cart');
    setsnakebarMessage(`${name} added to cart`);
    setsnakebarVisible(true);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={30} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Icon
              name={isFavorite(name) ? 'heart' : 'hearto'}
              size={28}
              color={isFavorite(name) ? '#ff5723' : '#000000'}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Image source={{uri: imageName}} style={styles.Image} />
        </View>
        <View style={styles.namecontainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
        <View style={styles.desccontainer}>
          <Text style={styles.descheading}>Delivery info</Text>
          <Text>
            Delivered between monday aug and thursday 20 from 8pm to 91:32 pm.
          </Text>
        </View>
        <View style={styles.desccontainer}>
          <Text style={styles.descheading}>Return policy</Text>
          <Text>
            All our foods are double checked before leaving our stores so by any
            case you found a broken food please contact our hotline immediately.
          </Text>
        </View>
        <View></View>
        {/* <View></View> */}
        {/* onPress={handleAddToCart} */}
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttontext}>Add to cart</Text>
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setsnakebarVisible(false)}
        duration={1100}
        action={{
          label: 'Close',
          onPress: () => setsnakebarVisible(false),
        }}>
        {snakebarMessage}
      </Snackbar>
    </>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15,
  },

  Image: {
    width: 240,
    height: 240,
    borderRadius: 24,
    marginHorizontal: 37,
  },
  namecontainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    color: '#000000',
    fontWeight: '600',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FA4A0C',
  },
  desccontainer: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  descheading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
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
});
