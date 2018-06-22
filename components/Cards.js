import React from 'react';
import styles from '../styles'

import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

class Cards extends React.Component {
  state = {
    num: 0
  }

  nextPhoto() {
    var num = this.state.num
    var length = this.props.imgUri.length - 1
    if (num >= length) {
      this.setState({ num: 0 })
    } else {
      num += 1
      this.setState({ num: num })
    }
  }

  render() {
    console.log("AQUI");
    console.log(this.props);
    return (
      <TouchableOpacity onPress={() => this.nextPhoto()}>
        <ImageBackground style={styles.card} source={{ uri: this.props.imgUri[this.state.num] }}>
          <View style={styles.cardDescription}>
            <View style={styles.cardInfo}>
              <Text style={styles.bold}>{this.props.nome}</Text>
              <Text>{this.props.sexo}</Text>
              <Text>{this.props.aboutMe}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    )
  }
}

export default Cards