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

  nextPhoto(){
    var num = this.state.num
    var length = this.props.images.length -1
    if (num >= length) {
      this.setState({ num: 0 })
    } else {
      num += 1
      this.setState({ num: num })
    }
  }

  render() {
    return (
        <TouchableOpacity onPress={() => this.nextPhoto()}>
          <ImageBackground style={styles.card} source={{uri: this.props.images[this.state.num]}}>
            <View style={styles.cardDescription}>
              <View style={styles.cardInfo}>
                <Text style={styles.bold}>{this.props.name}</Text>
                <Text>{this.props.aboutMe}</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
    )
  }
}

export default Cards