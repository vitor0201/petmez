import React from "react";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles";
import { deleteAnimal, updateAbout, logout } from "../redux/actions";

import {
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";

class Profile extends React.Component {
  // deleteImage() {
  //   this.self.props.dispatch(
  //     deleteImage(this.self.props.user.images, this.key)
  //   );
  // }

  // addImage() {
  //   this.props.dispatch(uploadImages(this.props.user.images));
  // }

  alertMenu() {
    console.log(this.self.props.user.animals);
    console.log(this.key);
    Alert.alert(
      "Opções",
      "",
      [
        {
          text: "Modificar",
          onPress: () => console.log("Ask me later pressed")
        },
        {
          text: "Apagar",
          onPress: this.self.props.dispatch(deleteAnimal(this.key, this.self.props.user.animals)),
        }
      ],
      { cancelable: true }
    );
  }

  updatePhone() {
    this.self.props.dispatch(updateAbout(this.text));

  }
  deleteConfirm() {
    Alert.alert(
      "Você tem certeza que deseja apagar ?",
      "",
      [
        {
          text: "Sim"
        },
        { text: "Não", onPress: () => console.log("Cancel Pressed") }
      ],
      { cancelable: true }
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
          <Text style={styles.bold}>Telefone</Text>
          <TextInput
            style={styles.inputStyle}
            keyboardType='numeric'
            // onChangeText={text => this.props.dispatch(updateAbout(text))}
            onChangeText={text => this.bind.updatePhone({ self: this, text })}
            value={this.props.user.aboutMe
            }
          />
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
