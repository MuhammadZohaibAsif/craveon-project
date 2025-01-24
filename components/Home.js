import {StyleSheet, Text,Modal, View, BackHandler, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import MenuItem from './MenuItem';
import Icon from 'react-native-vector-icons/AntDesign';
// import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {FlatList} from 'react-native-gesture-handler';
import {Snackbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
const Home = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbarVisible, setsnakebarVisible] = useState(false);
  const [snakebarMessage, setsnakebarMessage] = useState('');
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    // Fetch products from Firestore
    const fetchProducts = async () => {
      try {
        // console.log('Fetching products...');
        const productsList = [];
        const snapshot = await firestore().collection('Products').get();
        snapshot.forEach(doc => {
          // console.log('Product Data:', doc.data());
          productsList.push({...doc.data(), Id: doc.id}); // Add Firestore ID to the product
        });
        // console.log('Products List:', productsList);
        setProducts(productsList); // Update state with fetched data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const backAction = () => {
      if (isFocused) {
        // Only apply back button logic when on Home screen
        if (backPressedOnce) {
          BackHandler.exitApp(); // Close the app if back button is pressed twice on Home
          return false;
        } else {
          setBackPressedOnce(true);
          setsnakebarMessage('Press back again to exit');
          setsnakebarVisible(true);
          setTimeout(() => setBackPressedOnce(false), 2000); // Reset the flag after 2 seconds
          return true; // Prevent default back button behavior
        }
      }
      // For other screens, use default behavior to navigate back in the stack
      navigation.goBack(); // This will take the user back to the previous screen
      return true; // Prevent default behavior (which would exit the app)
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
    // Snackbar logic handled only here
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
      <View style={styles.loadingContainer}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          
          <Text style={styles.title}>Our Menu</Text>
        </View>
        {/* <View style={styles.swipecontainer}>
        <Icon1 name="swipe-up" style={styles.swipeicon} />
        <Text>swipe up to view all items</Text>
      </View> */}

        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.Id.toString()}
          // onEndReached={fetchMoreProducts}
          // onEndReachedThreshold={0.5}
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
    marginTop: 35,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
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
    paddingVertical:8,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
