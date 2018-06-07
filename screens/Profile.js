import React from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles'
import { uploadImages, deleteImage, updateAbout, logout } from '../redux/actions';

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

class Profile extends React.Component {
  deleteImage() {
    this.self.props.dispatch(deleteImage(this.self.props.user.images, this.key))
  }

  addImage() {
    this.props.dispatch(uploadImages(this.props.user.images))
  }

  render() {
    console.log(this.props.user)
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={[styles.container, styles.center]}>
          <Image style={styles.img} source={{ uri: this.props.user.photoUrl }} />
          <Text style={[styles.center, styles.bold]} >{this.props.user.name}</Text>
        </View>
        <View style={[styles.body, styles.center]}>
          <View style={[styles.imgRow, styles.center]}>
            {
              this.props.user.animals.map((animal, key) => {
                return (
                  <TouchableOpacity key={{ key }} onPress={this.deleteImage.bind({ self: this, key: key })} >
                    {/* <Image style={styles.img} source={{ uri: animal.image[0] }} /> */}
                    <Text>{animal.nome}</Text>
                  </TouchableOpacity>
                );
              })
            }
            <TouchableOpacity style={[styles.img, styles.center, styles.backgroundWhite]} onPress={() => this.props.navigation.navigate("Animal")}>
              <Ionicons name="ios-add" size={75} style={styles.isRed} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bold}>Telefone</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(text) => this.props.dispatch(updateAbout(text))}
            value={this.props.user.aboutMe} />
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.props.dispatch(logout())}>
            <Text style={styles.button}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Profile);