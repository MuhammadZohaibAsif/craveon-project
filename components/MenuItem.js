import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/AntDesign';
import CartContext from './CartContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const MenuItem = ({
  name,
  imageName,
  description,
  price,
  navigation,
  onaddtoCart,
  onToggleFavorite,
}) => {
  // const imagePath = ImageMap[imageName];
  const {addToCart, toggleFavorite, isFavorite} = useContext(CartContext);

  const handleToggleFavorite = () => {
    const currentStatus = isFavorite(name);
    const newStatus = !currentStatus;
    toggleFavorite({name, description, price, imageName});
    onToggleFavorite(name, newStatus);
  };

  const handleAddToCart = () => {
    addToCart(name, price, imageName);
    onaddtoCart(name);
  };
  const handleprodetails = () => {
    navigation.navigate('ProductDetails', {name, price, imageName});
  };

  return (


    
    <>
      <TouchableOpacity onPress={handleprodetails}>
        <View style={styles.container}>
          <Image source={{uri: imageName}} style={styles.Image} />

          <View style={styles.detailscontainer}>
            <View style={styles.textcontainer}>
              <Text style={styles.productname}>{name}</Text>

              <Text style={styles.productdescription}>{description}</Text>
              <Text style={styles.price}>{`RS -/ ${price}`}</Text>
            </View>
            <View style={styles.cartcontainer}>
              <TouchableOpacity
                style={styles.addtocart}
                onPress={handleAddToCart}>
                <Text style={styles.addtotext}>Add to</Text>
                <Icon1 name="shoppingcart" size={19} color="#ffffff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleToggleFavorite}>
                <Icon
                  name={isFavorite(name) ? 'heart' : 'hearto'}
                  size={26}
                  color={isFavorite(name) ? '#ff5723' : '#000000'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginHorizontal: 10,
    marginVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    elevation: 5,
    borderRadius: 5,
  },
  Image: {
    width: 140,
    height: 140,
    borderRadius: 5,
  },
  cartimage: {
    width: 24,
    height: 24,
  },

  detailscontainer: {
    flex: 1,
    padding: 10,
  },
  productname: {
    fontSize: 20,
    color: '#ff5723',
    fontWeight: 'bold',
  },
  productdescription: {
    fontSize: 13,
    color: '#000000',
    textAlign: 'justify',
  },
  cartcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    padding: 4,
    // marginHorizontal:,
    marginVertical: 8,
    borderRadius: 3,
    backgroundColor: '#f5cbe4',
    alignSelf: 'flex-start',
  },
  addtocart: {
    flexDirection: 'row',
    backgroundColor: '#ff5723',
    padding: 3,
    borderRadius: 3,
    alignItems: 'center',
  },
  addtotext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    margin: 2,
  },
});
