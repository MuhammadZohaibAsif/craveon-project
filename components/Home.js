import {
  StyleSheet,
  Text,
  Modal,
  View,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import MenuItem from './MenuItem';
import Icon from 'react-native-vector-icons/Entypo';
import Iconshoping from 'react-native-vector-icons/AntDesign';
import CartContext from './CartContext';
import {FlatList} from 'react-native-gesture-handler';
import {Snackbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
const Home = ({navigation}) => {
  const {getTotalCartItems} = useContext(CartContext);
  const cartItemCount = getTotalCartItems();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbarVisible, setsnakebarVisible] = useState(false);
  const [snakebarMessage, setsnakebarMessage] = useState('');
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsList = [];
        const snapshot = await firestore().collection('Products').get();
        snapshot.forEach(doc => {
          productsList.push({...doc.data(), Id: doc.id});
        });
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const backAction = () => {
      if (isFocused) {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        } else {
          setBackPressedOnce(true);
          setsnakebarMessage('Press back again to exit');
          setsnakebarVisible(true);
          setTimeout(() => setBackPressedOnce(false), 2000);
          return true;
        }
      } else {
        navigation.navigate('Home');
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [backPressedOnce, isFocused, navigation]);

  const handleaddtocart = itemName => {
    setModalMessage(`${itemName} added to cart`);
    setModalVisible(true);
  };

  const handleToggleFavorite = (itemName, isFavorite) => {
    if (isFavorite) {
      setsnakebarMessage(`${itemName} added to favorites`);
    } else {
      setsnakebarMessage(`${itemName} removed from favorites`);
    }
    setsnakebarVisible(true);
  };

  const renderItem = ({item}) => {
    return (
      <MenuItem
        name={item.name}
        imageName={item.image}
        price={item.price}
        description={item.description}
        navigation={navigation}
        isFavorite={item.isFavorite}
        onaddtoCart={handleaddtocart}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  };

  if (loading) {
    return (
      <>
        <View style={styles.loaderView}>
          <Text style={styles.loadertext}>
            Please wait products and fetching
          </Text>
          <ActivityIndicator
            size="large"
            color="#ff5723"
            style={styles.loader}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}
            style={styles.menuIconContainer}>
            <Icon name="menu" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Our Menu</Text>
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

        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.Id.toString()}
        />
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconContainer: {
    position: 'absolute',
    left: 10,
    padding: 10,
    paddingBottom: 25,
  },
  cartContainer: {
    position: 'absolute',
    right: 10,
    padding: 10,
    paddingBottom: 25,
  },
  badge: {
    position: 'absolute',
    right: 5,
    top: 5,
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
    marginRight: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    color: '#333',
    paddingHorizontal: 90,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
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
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#ff5723',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadertext: {
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
});
