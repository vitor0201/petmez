import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import ValidationComponent from "react-native-form-validator";
import { Ionicons } from "@expo/vector-icons";
import {
  uploadImages,
  deleteImage,
  updateAbout,
  addAnimal
} from "../redux/actions";
import * as firebase from "firebase";
import { ImagePicker } from "expo";

import {
  Text,
  Picker,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";

class Animal extends ValidationComponent {
  state = {
    nome: "",
    tipo: "Canino",
    sexo: "Macho",
    tamanho: "Pequeno",
    imgUri: []
  };

  addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });
    if (!result.cancelled) {
      this.setState({
        imgUri: [...this.state.imgUri, result.uri]
      });
    }
  };

  addAnimal() {
    this.validate({
      nome: { minlength: 3, maxlength: 30, required: true },
      tipo: { required: true },
      sexo: { required: true },
      tamanho: { required: true }
    });
    this.props.dispatch(addAnimal(this.state, this.props.user));
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.imgRow, styles.center]}>
          {this.state.imgUri.map((animal, key) => {
            return (
              <TouchableOpacity
                key={{ key }}
                onPress={() =>
                  this.setState({
                    imgUri: [
                      ...this.state.imgUri.slice(0, key),
                      ...this.state.imgUri.slice(key + 1)
                    ]
                  })
                }
              >
                <Image style={styles.img} source={{ uri: animal }} />
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[styles.img, styles.center, styles.backgroundWhite]}
            onPress={this.addImage}
          >
            <Ionicons name="ios-add" size={75} style={styles.isRed} />
          </TouchableOpacity>
        </View>
        <Text>Nome</Text>
        <TextInput
          style={styles.inputStyle}
          multiline={true}
          numberOfLines={5}
          onChangeText={nome => this.setState({ nome: nome })}
          value={this.state.nome}
        />
        <Text>Tipo</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.tipo}
          onValueChange={tipo => this.setState({ tipo: tipo })}
        >
          <Picker.Item label="Canino" value="canino" />
          <Picker.Item label="Felino" value="felino" />
          <Picker.Item label="Ave" value="ave" />
          <Picker.Item label="Peixe" value="peixe" />
          <Picker.Item label="Outro" value="outro" />
        </Picker>
        <Text>Sexo</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.sexo}
          onValueChange={sexo => this.setState({ sexo: sexo })}
        >
          <Picker.Item label="Macho" value="macho" />
          <Picker.Item label="Fêmea" value="femea" />
          <Picker.Item label="Sem Certeza" value="sem_certeza" />
        </Picker>
        <Text>Tamanho</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.tamanho}
          onValueChange={tamanho => this.setState({ tamanho: tamanho })}
        >
          <Picker.Item label="Pequeno" value="pequeno" />
          <Picker.Item label="Médio" value="medio" />
          <Picker.Item label="Grande" value="grande" />
        </Picker>

        <Text style={styles.isRed}>{this.getErrorMessages()}</Text>

        <TouchableOpacity onPress={() => this.addAnimal()}>
          <Text style={styles.button}>Salvar Animal</Text>
        </TouchableOpacity>
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
