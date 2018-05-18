import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { uploadImages, deleteImage, updateAbout, addAnimal } from '../redux/actions'
import * as firebase from 'firebase';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

class Animal extends React.Component {

  state = {
    animals: [],
  }

  componentWillMount() {
    console.log(" --- AQUI ---");
    console.log(this.props.user.animals);
    //   for (let x of this.props.user.animals) {
    //     console.log(x);
    //     // console.log(this.props.user.animals[x]);
    // }
    firebase.database().ref('cards/' + this.props.user.id + '/animals').on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        item = child.val()
        items.push(item);
      });
      this.setState({ animals: items.reverse() });
    });
  }

  deleteImage() {
    this.self.props.dispatch(deleteImage(this.self.props.user.images, this.key))
  }

  addImage() {
    this.props.dispatch(uploadImages(this.props.user.images))
  }

  render() {
    console.log(this.props.user);

    return (
      <ScrollView>

        <Text>FRAAN</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={5}
          onChangeText={(text) => this.props.dispatch(addAnimal(text, this.props.user.animals))}
          // value={this.props.user.aboutMe} 
          />
        {/* {this.props.user.animals.map((uri, key) => {
                return (
                  <TouchableOpacity key={{ key }} onPress={this.deleteImage.bind({ self: this, key: key })} >
                    <Image style={styles.img} source={{ uri: uri }} />
                  </TouchableOpacity>
                );
              })} */}

      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Animal);