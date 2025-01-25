import {
  StyleSheet,
  View,
  BackHandler,
  Alert,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Home from './Home';
import {GestureHandlerRootView} from 'react-native-gesture-handler'; /////
import Icon from 'react-native-vector-icons/AntDesign'; //////
import Icon1 from 'react-native-vector-icons/Fontisto';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import Cart from './Cart';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; /////
import {NavigationContainer, useNavigation} from '@react-navigation/native'; /////
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

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
const CustomDrawerContent = props => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          onPress: () => {
            // Clear user data or token here (if required)
            navigation.replace('SignIn'); // Navigate to SignIn screen
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.drawerContent}>
      {/* Logo and Tagline */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/22.png')} // Replace with your logo's path
          style={styles.logo}
        />
        <Text style={styles.tagline}>
          Fuel Your Cravings, Anytime, Anywhere!
        </Text>
      </View>

      {/* Default Drawer Items */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};
const DrawerNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.navigate('TabNavigator'); // Home screen under TabNavigator
        return true; // Stop default behavior
      } else {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Exit', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: true},
        );
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: '#ffffff'},
        drawerActiveTintColor: '#ff5723',
        drawerInactiveTintColor: '#000000',
      }}

      //  drawerContent={() => (
      //   <View style={styles.drawerContent}>
      //     {/* Logo and Tagline */}
      //     <View style={styles.logoContainer}>
      //       <Image
      //         source={require('../assets/logo.png')} // Replace with your logo's path
      //         style={styles.logo}
      //       />
      //       <Text style={styles.tagline}>
      //         Fuel Your Cravings, Anytime, Anywhere!
      //       </Text>
      //     </View>

      //     {/* Drawer Items */}
      //     <TouchableOpacity onPress={() => navigation.navigate('TabNavigator')}>
      //       <Text style={styles.drawerItem}>Dashboard</Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      //       <Text style={styles.drawerItem}>Profile</Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity onPress={() => navigation.navigate('History')}>
      //       <Text style={styles.drawerItem}>History</Text>
      //     </TouchableOpacity>
      //   </View>
      // )}
    >
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

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'center',
  },
  logo: {
    width: 150, // Adjust the size of the logo
    height: 150, // Adjust the size of the logo
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    borderRadius: 90,
    elevation: 3,
    marginBottom:10,
    padding:0
  },
  tagline: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff5723',
    fontWeight: 'bold',
  },
  drawerItem: {
    fontSize: 16,
    paddingVertical: 15,
    color: '#333',
  },
  signOutButton: {
    marginTop: 'auto', // Places it at the bottom
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#ff5723',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
