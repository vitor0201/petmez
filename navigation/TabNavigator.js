import React from 'react';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Matches from '../screens/Matches';
import { TabNavigator } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import styles from '../styles';

export default TabNavigator(
  {
    Main: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: <Ionicons name="md-person" size={32} color="green" />,
      },
    },
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: <Ionicons name="md-paw" size={32} color="green" />,
      }
    },
    Matches: {
      screen: Matches,
      navigationOptions: {
        tabBarLabel: <Ionicons name="md-chatbubbles" size={32} color="green" />,
      },
    },
  },
  {
    navigationOptions: {
      header: null
    },
    tabBarPosition: 'bottom',
    initialRouteName: 'Home',
    animationEnabled: true,
    swipeEnabled: false,
    tabBarOptions: {
      style: {
        height: 50,
        backgroundColor: '#e8f5e9',
      },
    }
  }
);