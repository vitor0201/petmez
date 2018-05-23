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
      <ScrollView style={styles.container}>
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