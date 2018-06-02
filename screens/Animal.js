import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux';
import ValidationComponent from 'react-native-form-validator';
import { Ionicons } from '@expo/vector-icons';
import { uploadImages, deleteImage, updateAbout, addAnimal } from '../redux/actions'
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';

import {
  Text,
  Picker,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,

} from 'react-native';

class Animal extends ValidationComponent {

  state = {
    nome: '',
    tipo: 'Canino',
    sexo: 'Macho',
    tamanho: 'Pequeno',
    imgUri: [],
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);
    console.log("cu");

    if (!result.cancelled) {
      // let arrayImg = this.state.imgUri;
      // arrayImg.push(resulti.uri);
      this.setState({
        imgUri: [...this.state.imgUri, result.uri]
      });
      // this.setState({ imgUri: arrayImg });
    }
  };



  deleteImage() {
    this.self.props.dispatch(deleteImage(this.self.props.user.images, this.key))
  }

  addImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);
    console.log("cu");

    if (!result.cancelled) {
      // let arrayImg = this.state.imgUri;
      // arrayImg.push(resulti.uri);
      this.setState({
        imgUri: [...this.state.imgUri, result.uri]
      });
      // this.setState({ imgUri: arrayImg });
    }
  }
  addAnimal() {
    this.validate({
      nome: { minlength: 3, maxlength: 30, required: true },
      tipo: { required: true },
      sexo: { required: true },
      tamanho: { required: true },
    });
    console.log(this.props.user.animals);
    console.log(this.state);
    // this.props.dispatch(addAnimal(this.state.nome, this.props.user.animals));
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        {
          (this.state.imgUri.map((animal, key) => {
            return (
              <TouchableOpacity key={{ key }} onPress={this.deleteImage.bind({ self: this, key: key })} >
                <Image style={styles.img} source={{ uri: animal }} />
              </TouchableOpacity>
            );
          }))}

        <TouchableOpacity
          style={styles.button}
          onPress={this._pickImage} >
          <Text style={styles.buttonText}>Choose</Text>
        </TouchableOpacity>
        <View style={[styles.imgRow, styles.center]}>
          {this.state.imgUri.map((animal, key) => {
            console.log(animal);
            return (
              <TouchableOpacity key={{ key }} onPress={this.deleteImage.bind({ self: this, key: key })} >
                <Image style={styles.img} source={{ uri: animal.image }} />
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={[styles.img, styles.center]} onPress={this.addImage}>
            <Ionicons name="ios-add" size={75} style={styles.color} />
          </TouchableOpacity>
        </View>
        <Text>Nome</Text>
        <TextInput
          style={styles.inputStyle}
          multiline={true}
          numberOfLines={5}
          onChangeText={(nome) => this.setState({ nome: nome })}
          value={this.state.nome}
        />
        <Text>Tipo</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.tipo}
          onValueChange={(tipo) => this.setState({ tipo: tipo })}>
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
          onValueChange={(sexo) => this.setState({ sexo: sexo })}>
          <Picker.Item label="Macho" value="macho" />
          <Picker.Item label="Fêmea" value="femea" />
          <Picker.Item label="Sem Certeza" value="sem_certeza" />
        </Picker>
        <Text>Tamanho</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.tamanho}
          onValueChange={(tamanho) => this.setState({ tamanho: tamanho })}>
          <Picker.Item label="Pequeno" value="pequeno" />
          <Picker.Item label="Médio" value="medio" />
          <Picker.Item label="Grande" value="grande" />
        </Picker>

        <Text style={styles.color}>
          {this.getErrorMessages()}
        </Text>

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