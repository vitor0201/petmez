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
  addAnimal() {
    if (this.props.user.animals) {
      {
        this.props.user.animals.map((animal, key) => {
          return (
            <TouchableOpacity key={{ key }} onPress={this.deleteImage.bind({ self: this, key: key })} >
              <Image style={styles.img} source={{ uri: animal.image }} />
            </TouchableOpacity>
          );
        })
      }
    }
  }
  render() {
    let bacon = 3;
    return (
      <View>
        <View style={styles.statusBar} />
        <ScrollView>
          <View style={[styles.container, styles.center, styles.border]}>
            <View style={styles.container}>
              <Image style={styles.img} source={{ uri: this.props.user.photoUrl }} />
              <Text style={[styles.center, styles.bold]} >{this.props.user.name}</Text>
            </View>
            <View style={[styles.imgRow, styles.center]}>
              {this.addAnimal}
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
          <TouchableOpacity onPress={() => this.props.dispatch(logout())}>
            <Text style={styles.button}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
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