import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FlashMessage from 'react-native-flash-message';

import MainNavigation from './MainNavigation';
// import Filters from '../screens/Filters';
// import TC from '../screens/T&C';
import AboutUs from '../screens/AboutUs';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="DashBoard" component={MainNavigation} />
        <Drawer.Screen name="About Us" component={AboutUs} />
      </Drawer.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};

export default AppNavigator;