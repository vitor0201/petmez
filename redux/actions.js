import * as firebase from "firebase";
import { Alert } from "react-native";
import { ImagePicker, Location, Permissions, Notifications } from "expo";
import Geohash from "latlon-geohash";

export function login(user) {
  return function (dispatch) {
    let params = {
      id: user.uid,
      photoUrl: user.photoURL,
      name: user.displayName,
      aboutMe: " ",
      chats: " ",
      geocode: " ",
      images: [user.photoURL],
      notification: false,
      show: false,
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

export function deleteImage(images, key) {
  return function (dispatch) {
    Alert.alert(
      "Are you sure you want to Delete",
      "",
      [
        {
          text: "Ok",
          onPress: () => {
            var array = images;
            array.splice(key, 1);
            dispatch({ type: "UPLOAD_IMAGES", payload: array });
            firebase
              .database()
              .ref("cards/" + firebase.auth().currentUser.uid + "/images")
              .set(array);
          }
        },
        { text: "Cancel", onPress: () => console.log("Cancel Pressed") }
      ],
      { cancelable: true }
    );
  };
}

export function updateAbout(value) {
  return function (dispatch) {
    dispatch({ type: "UPDATE_ABOUT", payload: value });
    setTimeout(function () {
      firebase
        .database()
        .ref("cards/" + firebase.auth().currentUser.uid)
        .update({ aboutMe: value });
    }, 3000);
  };
}

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

export function logout() {
  return function (dispatch) {
    firebase.auth().signOut();
    dispatch({ type: "LOGOUT", loggedIn: false });
  };
}
export function getCards(geocode) {
  return function (dispatch) {
    firebase
      .database()
      .ref("cards")
      .orderByChild("geocode")
      .equalTo(geocode)
      .once("value", snap => {
        var items = [];
        var animals = [];
        snap.forEach(child => {
          item = child.val();
          item.id = child.key;
          item.animals.forEach(animal => {
            // console.log(animal);
            animal.userId = item.id;
            animals.push(animal);
          });
          items.push(item);
        });
        console.log(animals);
        dispatch({ type: "GET_CARDS", payload: animals });
      });
  };
}
