import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux';
import ValidationComponent from 'react-native-form-validator';
import { Ionicons } from '@expo/vector-icons';
import { uploadImages, deleteImage, updateAbout, addAnimal } from '../redux/actions'
import * as firebase from 'firebase';
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
    tamanho: 'Pequeno'
  }

  deleteImage() {
    this.self.props.dispatch(deleteImage(this.self.props.user.images, this.key))
  }

  addImage() {
    this.props.dispatch(uploadImages(this.props.user.images))
  }
  addAnimal() {
    console.log("LU");
    console.log(this.state);
    console.log("/LU");
    this.validate({
      nome: { minlength: 3, maxlength: 30, required: true },
      tipo: { required: true },
      sexo: { required: true },
      tamanho: { required: true },
    });
    this.props.dispatch(addAnimal(this.state.nome, this.props.user.animals));
  }
  render() {
    this.props.user;

    return (
      <ScrollView>

        <Text>Nome</Text>
        <TextInput
          deviceLocale="fr"
          style={styles.textInput}
          multiline={true}
          numberOfLines={5}
          onChangeText={(nome) => this.setState({ nome: nome })}
          value={this.state.nome}
          deviceLocale="fr" 
        />
        <Text>Tipo</Text>
        <Picker
          selectedValue={this.state.tipo}
          style={{ height: 50, width: 100 }}
          onValueChange={(tipo) => this.setState({ tipo: tipo })}>
          <Picker.Item label="Canino" value="canino" />
          <Picker.Item label="Felino" value="felino" />
          <Picker.Item label="Ave" value="ave" />
          <Picker.Item label="Peixe" value="peixe" />
          <Picker.Item label="Outro" value="outro" />
        </Picker>
        <Text>Sexo</Text>
        <Picker
          selectedValue={this.state.sexo}
          style={{ height: 50, width: 100 }}
          onValueChange={(sexo) => this.setState({ sexo: sexo })}>
          <Picker.Item label="Macho" value="macho" />
          <Picker.Item label="Fêmea" value="femea" />
          <Picker.Item label="Sem Certeza" value="sem_certeza" />
        </Picker>
        <Text>Tamanho</Text>
        <Picker
          selectedValue={this.state.tamanho}
          style={{ height: 50, width: 100 }}
          onValueChange={(tamanho) => this.setState({ tamanho: tamanho })}>
          <Picker.Item label="Pequeno" value="pequeno" />
          <Picker.Item label="Médio" value="medio" />
          <Picker.Item label="Grande" value="grande" />
        </Picker>

        <Text>
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