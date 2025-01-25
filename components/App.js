import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Home from './Home';
import {GestureHandlerRootView} from 'react-native-gesture-handler'; /////
import Icon from 'react-native-vector-icons/AntDesign'; //////
import Icon1 from 'react-native-vector-icons/Fontisto';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import Cart from './Cart';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; /////
import {NavigationContainer, useNavigation} from '@react-navigation/native'; /////
import {createDrawerNavigator} from '@react-navigation/drawer';

import SplashScreen from './SplashScreen';
import ProductDetails from './ProductDetails';
import {CartProvider} from './CartContext';
import CheckOut from './CheckOut';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'; /////
import MyProfile from './MyProfile';
import Order from './Order';
import DeliveryCheckOut from './DeliveryCheckOut';
import Favourits from './Favourits';
import History from './History';
import SignIn from './SignIn';
import SignUp from './SignUp';
const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: '#f0f0f0',
        tabBarStyle: {backgroundColor: '#ffffff'},
        tabBarActiveTintColor: '#ff5723',
        tabBarInactiveTintColor: '#000000',
      }}>
      <Tab.Screen
        name="Favourits"
        component={Favourits}
        options={{
          tabBarLabel: 'Favourits',
          tabBarIcon: ({color, size}) => (
            <Icon2 name="favorite" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({color, size}) => (
            <Icon name="shoppingcart" size={size} color={color} />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Order"
        component={Order}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({color, size}) => (
            <Icon1 name="shopping-bag-1" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: '#ffffff'},
        drawerActiveTintColor: '#ff5723',
        drawerInactiveTintColor: '#000000',
      }}>
      <Drawer.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          title: 'Dashboard',
          drawerLabel: 'Dashboard',
          drawerIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={MyProfile}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({color, size}) => (
            <Icon1 name="person" size={size} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Cart"
        component={Cart}
        options={{
          drawerLabel: 'Cart',
          drawerIcon: ({color, size}) => (
            <Icon name="shoppingcart" size={size} color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="History"
        component={History}
        options={{
          drawerLabel: 'History',
          drawerIcon: ({color, size}) => (
            <Icon1 name="history" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="CheckOut" component={CheckOut} />
            <Stack.Screen
              name="DeliveryCheckOut"
              component={DeliveryCheckOut}
            />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Favourits" component={Favourits} />
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="Cart" component={Cart} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
