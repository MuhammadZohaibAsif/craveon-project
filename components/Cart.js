import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons1 from 'react-native-vector-icons/FontAwesome';
import Iconmenu from 'react-native-vector-icons/Entypo';

import CartContext from './CartContext';
import {FlatList, Swipeable} from 'react-native-gesture-handler';
// import Order from './Order';

const Cart = ({navigation}) => {
  const {cartitem, updateQuantity, updateCart, calculateTotal} =
    useContext(CartContext);

  const increaseQuantity = name => {
    const item = cartitem.find(item => item.name === name);
    if (item) {
      updateQuantity(name, item.quantity + 1);
    }
  };
  const decreaseQuantity = name => {
    const item = cartitem.find(item => item.name === name);
    if (item && item.quantity > 1) {
      updateQuantity(name, item.quantity - 1);
    }
  };

  const handleCheckout = () => {
    const total = calculateTotal();
    navigation.navigate('CheckOut', {total}); // Cart clear yahan nahi hoga
  };

  const removefromcart = name => {
    const updatedCart = cartitem.filter(item => item.name !== name);
    updateCart(updatedCart); // Make sure this works as expected
  };
  const renderRightAction = item => (
    <TouchableOpacity
      onPress={() => removefromcart(item.name)}
      style={styles.deleteIcon}>
      <Icons1 name="trash" size={27} color="#ff5723" />
    </TouchableOpacity>
  );
  const renderItem = ({item, index}) => (
    <Swipeable
      key={item.name}
      renderRightActions={() => renderRightAction(item)}>
      <View style={styles.cartitem} key={index}>
        <Image source={{uri: item.image}} style={styles.image} />
        <View style={styles.itemdetails}>
          <Text style={styles.itemname}>{item.name}</Text>
          <Text style={styles.itemprice}>{`RS-/ ${item.price}`}</Text>
        </View>
        <View style={styles.qcontainer}>
          <View style={styles.quantitycontainer}>
            <TouchableOpacity
              style={styles.quantitybutton}
              onPress={() => decreaseQuantity(item.name)}>
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityvalue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantitybutton}
              onPress={() => increaseQuantity(item.name)}>
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Swipeable>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={() => navigation.navigate("DrawerNavigator")}>
          <Icon
            name="left"
            size={30}
            color="#333"
            // style={styles.backbutton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Cart</Text>
      </View>

      {cartitem.length === 0 ? (
        <View style={styles.content}>
          <Icon
            name="shoppingcart"
            size={100}
            color="#b8b7b4"
            style={styles.icon}
          />
          <Text style={styles.nohistorytext}>No items in cart</Text>
          <Text style={styles.description}>
            Hit the "Home" icon down below to Create an order
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.gesturecontainer}>
            <Icons name="gesture-swipe-left" size={24} />
            <Text>swipe left to delete items</Text>
          </View>
          <View style={styles.item}>
            <FlatList
              data={cartitem}
              renderItem={renderItem}
              extraData={cartitem}
              removeClippedSubviews={true}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
            />
          </View>
          <TouchableOpacity
            style={styles.opacitybutton}
            onPress={handleCheckout}>
            <Text style={styles.buttonText}>Complete order</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    margin: 25,
    flex: 1,
    // justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 15,
    alignItems: 'center',
  },
  menuIconContainer: {
    position: 'absolute', // To make it left-aligned
    left: -4.05,
    top: -1.5,
    // paddingRight: 10,
    // paddingBottom: 25,
  },
  backbutton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: '#333',
    paddingHorizontal: 90,
    fontWeight: 'bold',
  },
  gesturecontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 15,
    padding: 10,
  },

  opacitybutton: {
    alignItems: 'center',
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 30,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
  },
  cartitem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 18,
    elevation: 3,
  },
  image: {
    width: 67,
    height: 67,
    borderRadius: 40,
    marginRight: 15,
  },
  quantitycontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff5733',
    borderRadius: 20,
    width: 66,
    height: 27,
    justifyContent: 'center',
  },
  qcontainer: {
    justifyContent: 'flex-end',
  },
  quantitybutton: {
    paddingHorizontal: 7,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quantityvalue: {
    paddingHorizontal: 2,
    color: '#ffffff',
  },
  itemdetails: {
    flex: 1,
  },
  itemname: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  itemprice: {
    color: '#FF5733',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 15,
  },
  item: {
    flex: 1,
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
  content: {
    marginTop: 240,
    alignItems: 'center',
  },
  icon: {
    height: 110,
    width: 110,
    // marginBottom: 10,
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
});
