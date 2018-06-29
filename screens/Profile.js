import React from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Picker,
} from 'react-native';
import styles from '../styles';
import { deleteAnimal, filterUpdate, logout } from '../redux/actions';

class Profile extends React.Component {
  alertMenu() {
    Alert.alert(
      'Deseja Apagar:',
      '',
      [
        {
          text: 'Apagar',
          onPress: this.self.props.dispatch(
            deleteAnimal(this.key, this.self.props.user.animals)
          )
        },
        { text: 'Cancelar', onPress: () => console.log('Cancel Pressed') }
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={[styles.container, styles.center]}>
          <Image
            style={styles.img}
            source={{ uri: this.props.user.photoUrl }}
          />
          <Text style={[styles.center, styles.bold]}>
            {this.props.user.name}
          </Text>
        </View>
        <View style={[styles.body, styles.center]}>
          <View style={[styles.imgRow, styles.center]}>
            {this.props.user.animals &&
              this.props.user.animals.map((animal, key) => {
                return (
                  <TouchableOpacity
                    key={{ key }}
                    onPress={this.alertMenu.bind({ self: this, key: key })}
                  >
                    <Image
                      style={styles.img}
                      source={{ uri: animal.imgUri[0] }}
                    />
                  </TouchableOpacity>
                );
              })}
            <TouchableOpacity
              style={[styles.img, styles.center, styles.backgroundWhite]}
              onPress={() => this.props.navigation.navigate("Animal")}
            >
              <Ionicons name="ios-add" size={75} style={styles.isRed} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bold}>Animal Desejado</Text>
          <Picker
            style={styles.inputStyle}
            selectedValue={this.props.user.filter}
            onValueChange={tipo => this.props.dispatch(filterUpdate(tipo))}
          >
            <Picker.Item label="Todos" value="todos" />
            <Picker.Item label="Canino" value="canino" />
            <Picker.Item label="Felino" value="felino" />
            <Picker.Item label="Ave" value="ave" />
            <Picker.Item label="Peixe" value="peixe" />
            <Picker.Item label="Outro" value="outro" />
          </Picker>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.props.dispatch(logout())}>
            <Text style={styles.button}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Profile);
