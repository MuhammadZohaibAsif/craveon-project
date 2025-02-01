import {Children, createContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CartContext = createContext();
export const CartProvider = ({children}) => {
  const [cartitem, setCartItem] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [orderTimestamp, setOrderTimestamp] = useState(null);

  const setOrderTime = (timestamp) => {
    setOrderTimestamp(timestamp);
  };
  const user = auth().currentUser;
  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection('Users')
        .doc(user.uid)
        .onSnapshot(
          snapshot => {
            if (snapshot.exists) {
              const data = snapshot.data();
              setFavoriteItems(data?.favorites || []); 
            } else {
              console.log('User document not found');
              setFavoriteItems([]); 
            }
          },
          error => {
            console.error('Error fetching user data:', error);
          },
        );

      return () => unsubscribe(); 
    }
  }, [user]);

  const toggleFavorite = async product => {
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const userRef = firestore().collection('Users').doc(user.uid);
    const currentFavorites = [...favoriteItems];

    if (currentFavorites.some(item => item.name === product.name)) {
      const updatedFavorites = currentFavorites.filter(
        item => item.name !== product.name,
      );
      await userRef.update({favorites: updatedFavorites});
      setFavoriteItems(updatedFavorites); 
    } else {
      const updatedFavorites = [...currentFavorites, product];
      await userRef.update({favorites: updatedFavorites});
      setFavoriteItems(updatedFavorites);
    }
  };

  const isFavorite = name => {
    return favoriteItems.some(item => item.name === name);
  };

  const addToCart = (name, price, imagePath) => {
    item = {name, price, image: imagePath, quantity: 1};

    setCartItem(previousItems => {
      const existingitem = previousItems.find(item => item.name === name);
      if (existingitem) {
        return [...previousItems];
      } else {
        return [...previousItems, item];
      }
    });
  };
  const updateCart = updatedCart => {
    setCartItem(updatedCart);
  };
  const updateQuantity = (name, newQuantity) => {
    setCartItem(previousItems => {
      return previousItems.map(item => {
        if (item.name === name) {
          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      });
    });
  };

  const calculateTotal = () => {
    return cartitem.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const setOrderData = (orderNumber, total) => {
    const currentDate = new Date();

    const date = currentDate.toLocaleDateString(); 
    const time = currentDate.toLocaleTimeString(); 

    setOrderDetails({orderNumber, total, date, time, items: cartitem});
  };

  const clearOrderDetails = () => {
    setOrderDetails({}); 
  };

  const getTotalCartItems = () => {
    return cartitem.length 
  };
  return (
    <CartContext.Provider
      value={{
        addToCart,
        cartitem,
        updateQuantity,
        updateCart,
        getTotalCartItems,
        calculateTotal,
        setOrderData,
        orderDetails,
        favoriteItems, 
        toggleFavorite, 
        isFavorite, 
        clearOrderDetails,
        orderTimestamp, 
        setOrderTime,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
