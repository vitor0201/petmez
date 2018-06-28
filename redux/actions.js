import * as firebase from "firebase";
import { Alert } from "react-native";
import { ImagePicker, Location, Permissions, Notifications } from "expo";
import Geohash from "latlon-geohash";

/**
 * Função que cria o state e verifica o login
 * @param {*} user 
 */
export function login(user) {
  return function (dispatch) {

    let params = {
      id: user.uid,
      photoUrl: user.photoURL,
      name: user.displayName,
      aboutMe: " ",
      chats: " ",
      geocode: " ",
      filter: "todos",
      images: [user.photoURL],
      notification: false,
      show: false,
      matches: [],
      report: false,
      animals: [],
      swipes: {
        [user.uid]: false
      },
      token: " "
    };

    firebase
      .database()
      .ref("cards/")
      .child(user.uid)
      .once("value", function (snapshot) {
        if (snapshot.val() !== null) {
          dispatch({ type: "LOGIN", user: snapshot.val(), loggedIn: true });
          dispatch(allowNotification());
        } else {
          firebase
            .database()
            .ref("cards/" + user.uid)
            .update(params);
          dispatch({ type: "LOGIN", user: params, loggedIn: true });
        }
        dispatch(getLocation());
      });
  };
}
/**
 * Função que solicita notificação para verificar quando mensagem
 */
export function allowNotification() {
  return function (dispatch) {
    Permissions.getAsync(Permissions.NOTIFICATIONS).then(function (result) {
      if (result.status === "granted") {
        Notifications.getExpoPushTokenAsync().then(function (token) {
          firebase
            .database()
            .ref("cards/" + firebase.auth().currentUser.uid)
            .update({ token: token });
          dispatch({ type: "ALLOW_NOTIFICATION", payload: token });
        });
      }
    });
  };
}
/**
 * Função que faz filtro do animal
 * @param {*} filter 
 */
export function filterUpdate(filter) {
  return function (dispatch) {
    dispatch({ type: "FILTER_UPDATE", payload: filter });
    firebase
      .database()
      .ref("cards/" + firebase.auth().currentUser.uid)
      .update({ filter: filter });
  };
}
/**
 * Função que verifica se existe o match
 * @param {*} card 
 * @param {*} state 
 */
export function match(card, state) {
  return function (dispatch) {

    if (!state.matches) {
      state.matches = [];
    }
    var matches = state.matches;
    matches.push(card);

    console.log(matches);
    dispatch({ type: "MATCH_CARD", payload: matches });
    firebase
      .database()
      .ref("cards/" + state.id + '/matches/')
      .update(matches);
  };
}
/**
 * Função que quando existe a conversa envia mensagem
 * @param {*} id 
 * @param {*} name 
 * @param {*} text 
 */
export function sendNotification(id, name, text) {
  return function (dispatch) {
    firebase
      .database()
      .ref("cards/" + id)
      .once("value", snap => {
        if (snap.val().token != null) {
          return fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: snap.val().token,
              title: name,
              body: text,
              badge: 1
            })
          });
        }
      });
  };
}
/**
 * Função que pega e permite as notificações
 */
export function getLocation() {
  return function (dispatch) {
    Permissions.askAsync(Permissions.LOCATION).then(function (result) {
      if (result) {
        Location.getCurrentPositionAsync({}).then(function (location) {
          var geocode = Geohash.encode(
            location.coords.latitude,
            location.coords.longitude,
            6
          );
          firebase
            .database()
            .ref("cards/" + firebase.auth().currentUser.uid)
            .update({ geocode: geocode });
          dispatch({ type: "GET_LOCATION", payload: geocode });
        });
      }
    });
  };
}
/**
 *
 * @param {*} images
 * TODO: Transformar uploadImages(images) em função pura
 */
export function uploadImages(images) {
  return function (dispatch) {
    ImagePicker.launchImageLibraryAsync({ allowsEditing: false }).then(function (
      result
    ) {
      if (!result.cancelled) {
        var array = images;
        this.uploadImageHelper(result.uri, "test-6662")
          .then(e => {
            Alert.alert("Success");
            array.push(e);
            firebase
              .database()
              .ref("cards/" + firebase.auth().currentUser.uid + "/images")
              .set(array);
          })
          .catch(error => {
            Alert.alert(error);
          });
        dispatch({ type: "UPLOAD_IMAGES", payload: array });
      }
    });
  };
}
/**
 * Auxilia o upload de imagens
 */
uploadImageHelper = async (uri, imageName) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  var ref = firebase
    .storage()
    .ref()
    .child("images/" + imageName);
  const snapshot = await ref.put(blob);
  return snapshot.downloadURL;
};
/**
 * Função para adicionar animal
 * @param {*} state 
 * @param {*} props 
 */
export function addAnimal(state, props) {
  return function (dispatch) {
    var helper = 0;
    console.log(props);
    var array = [];
    if (props.animals) {
      array = props.animals;
    }
    var promisses = state.imgUri.map(e => {
      var nameImg = Math.random() * Date.now() + "" + props.id + helper;
      var imgReturn = this.uploadImageHelper(e, nameImg);
      helper += 1;
      return imgReturn;
    });
    Promise.all(promisses).then(e => {
      console.log(state);
      console.log(e);
      let newId = firebase
        .database()
        .ref()
        .child("animals")
        .push().key;
      let newAnimal = {
        id: newId,
        nome: state.nome,
        sexo: state.sexo,
        tamanho: state.tamanho,
        tipo: state.tipo,
        imgUri: e
      };
      array.push(newAnimal);
      dispatch({ type: "ANIMAL_ADD", payload: array });
      firebase
        .database()
        .ref("cards/" + firebase.auth().currentUser.uid + "/animals")
        .set(array);
      return;
    });
  };
}
/**
 * Função para deletar animal
 * @param {*} element 
 * @param {*} state 
 */
export function deleteAnimal(element, state) {
  return function (dispatch) {
    Alert.alert(
      "Você tem certeza que deseja apagar ?",
      "",
      [
        {
          text: "Sim",
          onPress: () => {
            var array = state;
            if (element > -1) {
              state.splice(element, 1);
              firebase
                .database()
                .ref("cards/" + firebase.auth().currentUser.uid + "/animals")
                .set(array);
              dispatch({ type: "ANIMAL_ADD", payload: array });
            }
          }
        },
        { text: "Não", onPress: () => console.log("Cancel Pressed") }
      ],
      { cancelable: true }
    );
  };
}
/**
 * Função para deslogar
 */
export function logout() {
  return function (dispatch) {
    firebase.auth().signOut();
    dispatch({ type: "LOGOUT", loggedIn: false });
  };
}
/**
 * Função que pega os cartões, verificando se já houve anteriormente o match
 * @param {*} state 
 */
export function getCards(state) {
  return function (dispatch) {

    var geocode = state.geocode;
    var filter = state.filter;
    var id = state.id;
    var matches = state.matches;

    // console.log(state.matches.includes('ORNITORRINCO'));

    firebase
      .database()
      .ref("cards")
      .orderByChild("geocode")
      .equalTo(geocode)
      .on("value", snap => {
        var animals = [];
        snap.forEach(child => {
          item = child.val();
          console.log(item);
          item.id = child.key;
          if (item.animals && item.id != id) {
            item.animals.forEach(animal => {

              // console.log(filter);
              // console.log(animal.tipo);
              if (((matches) ? !matches.includes(animal.id) : true) &&
                (filter.toLowerCase() === "todos" ||
                  filter.toLowerCase() === animal.tipo.toLowerCase())
              ) {
                animal.userId = item.id;
                animals.push(animal);
              }
            });
          }
        });
        // console.log(animals);
        dispatch({ type: "GET_CARDS", payload: animals });
      });
  };
}
