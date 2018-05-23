import React from 'react';
import styles from '../styles'
import { Alert } from 'react-native';
import RootNavigator from '../navigation/RootNavigator';
import { connect } from 'react-redux';
import { login } from '../redux/actions'
import * as firebase from 'firebase';
import firebaseConfig from '../config/firebase.js'
firebase.initializeApp(firebaseConfig);

import {
  Text,
  View,
  TouchableOpacity,
  Image 
} from 'react-native';

class Login extends React.Component {
  state = {}

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.props.dispatch(login(user))
      }
    });
  }

  login = async () => {
    var teste = 1;
    
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1711396202232786', {
      permissions: ['public_profile'],
    });
    if (type === 'success') {
      // Build Firebase credential with the Facebook access token.
      const credential = await firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      firebase.auth().signInWithCredential(credential).catch((error) => {
        // Handle Errors here.
        Alert.alert("Tente novamente !")
      });
    }
  }

  render() {
    if (this.props.loggedIn) {
      return (
        <RootNavigator />
      )
    } else {
      return (
        <View style={[styles.container, styles.center]}>
          <Image source={require('../assets/icon.png')} style={{width: 90, height: 90}}/>
          <TouchableOpacity onPress={this.login.bind(this)}>
            <Text style={styles.button}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: state.loggedIn
  };
}

export default connect(mapStateToProps)(Login);