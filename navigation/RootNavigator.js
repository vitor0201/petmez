import React from 'react';
import { StackNavigator } from 'react-navigation';
import TabNavigator from './TabNavigator.js';
import Chat from '../screens/Chat.js';
import Animal from '../screens/Animal';
import Profile from '../screens/Profile';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: TabNavigator,
    },
    Chat: {
      screen: Chat,
    },
    Animal: {
      screen: Animal,
    },
    Profile: {
      screen: Profile,
    },
  }
);

export default class RootNavigator extends React.Component {
  render() {
    return <RootStackNavigator />;
  }
}