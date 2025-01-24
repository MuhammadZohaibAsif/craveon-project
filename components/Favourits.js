import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/AntDesign';
import CartContext from './CartContext';

const Favourits = ({navigation}) => {
  const {addToCart, favoriteItems, toggleFavorite} = useContext(CartContext);

  const handleHistory = () => {
    navigation.navigate('MyProfile'); // Move navigation here to avoid the warning
  };

  const handleAddToCart = item => {
    navigation.navigate('ProductDetails', {
      name: item.name,
      price: item.price,
      imageName: item.imageName,
    });
  };

  const renderItem = ({item}) => (
    <View style={styles.container}>
      <Image source={{uri: item.imageName}} style={styles.Image} />

      <View style={styles.detailscontainer}>
        <View style={styles.textcontainer}>
          <Text style={styles.productname}>{item.name}</Text>
          <Text style={styles.productdescription}>{item.description}</Text>
          <Text style={styles.price}>RS -/ {item.price}</Text>
        </View>

        <View style={styles.cartcontainer}>
          <TouchableOpacity
            style={styles.addtocart}
            onPress={() => handleAddToCart(item)}>
            <Text style={styles.addtotext}>Add to</Text>
            <Icon1 name="shoppingcart" size={19} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <Icon name="trash-outline" size={26} color="#ff5723" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.favcontainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon2
            name="left"
            size={26}
            color="black"
            style={styles.backbutton}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Favourites</Text>
      </View>

      {favoriteItems.length > 0 ? (
        <FlatList
          data={favoriteItems}
          renderItem={renderItem}
          keyExtractor={item => item.name}
          contentContainerStyle={styles.flatlistContainer}
        />
      ) : (
        <View style={styles.content}>
          <Icon1 name="heart" size={90} color="#b8b7b4" style={styles.icon} />
          <Text style={styles.nohistorytext}>No favourits yet</Text>
          <Text style={styles.description}>
            Hit the "Home" icon down below to Create an order
          </Text>
        </View>
      )}
    </View>
  );
};

export default Favourits;

const styles = StyleSheet.create({
  favcontainer: {
    flex: 1,
    // justifyContent: "space-between",
    // padding: 25,
    backgroundColor: '##f9f9f9',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 42,

    alignItems: 'center',
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
  },
  content: {
    marginTop:220,
    alignItems: 'center',
  },
  icon: {
    height: 100,
    width: 90,
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

  container: {
    // flex:1,
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
