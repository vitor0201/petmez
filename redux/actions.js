import * as firebase from 'firebase';
import { Alert } from 'react-native';
import aws from '../config/aws';
import { ImagePicker, Location, Permissions, Notifications } from 'expo';
import { RNS3 } from 'react-native-aws3';
import Geohash from 'latlon-geohash';

export function login(user) {
  return function (dispatch) {
    let params = {
      id: user.uid,
      photoUrl: user.photoURL,
      name: user.displayName,
      aboutMe: ' ',
      chats: ' ',
      geocode: ' ',
      images: [user.photoURL],
      notification: false,
      show: false,
      report: false,
      animals: [],
      swipes: {
        [user.uid]: false
      },
      token: ' ',
    }

    firebase.database().ref('cards/').child(user.uid).once('value', function (snapshot) {
      if (snapshot.val() !== null) {
        dispatch({ type: 'LOGIN', user: snapshot.val(), loggedIn: true });
        dispatch(allowNotification());
      } else {
        firebase.database().ref('cards/' + user.uid).update(params);
        dispatch({ type: 'LOGIN', user: params, loggedIn: true });
      }
      dispatch(getLocation());
    })
  }
}

export function allowNotification() {
  return function (dispatch) {
    Permissions.getAsync(Permissions.NOTIFICATIONS).then(function (result) {
      if (result.status === 'granted') {
        Notifications.getExpoPushTokenAsync().then(function (token) {
          firebase.database().ref('cards/' + firebase.auth().currentUser.uid).update({ token: token });
          dispatch({ type: 'ALLOW_NOTIFICATION', payload: token });
        })
      }
    })
  }
}

export function sendNotification(id, name, text) {
  return function (dispatch) {
    firebase.database().ref('cards/' + id).once('value', (snap) => {
      if (snap.val().token != null) {

        return fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: snap.val().token,
            title: name,
            body: text,
            badge: 1,
          }),
        });

      }
    });
  }
}
export function getLocation() {
  return function (dispatch) {
    Permissions.askAsync(Permissions.LOCATION).then(function (result) {
      if (result) {
        Location.getCurrentPositionAsync({}).then(function (location) {
          var geocode = Geohash.encode(location.coords.latitude, location.coords.longitude, 6)
          firebase.database().ref('cards/' + firebase.auth().currentUser.uid).update({ geocode: geocode });
          dispatch({ type: 'GET_LOCATION', payload: geocode });
        })
      }
    })
  }
}
/**
 * 
 * @param {*} images 
 * TODO: Transformar uploadImages(images) em função pura
 */
export function uploadImages(images) {
  return function (dispatch) {
    ImagePicker.launchImageLibraryAsync({ allowsEditing: false }).then(function (result) {
      if (!result.cancelled) {

        var array = images
        this.uploadImageHelper(result.uri, "test-6662")
          .then((e) => {
            console.log(e);
            Alert.alert("Success");
            array.push(e);
            firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set(array);
          })
          .catch((error) => {
            Alert.alert(error);
          });
        dispatch({ type: 'UPLOAD_IMAGES', payload: array });
      }
    });
  }
}

uploadImageHelper = async (uri, imageName) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  var ref = firebase.storage().ref().child("images/" + imageName);
  const snapshot = await ref.put(blob);
  return snapshot.downloadURL;
}
export function deleteImage(images, key) {
  return function (dispatch) {
    Alert.alert(
      'Are you sure you want to Delete',
      '',
      [
        {
          text: 'Ok', onPress: () => {
            var array = images
            array.splice(key, 1)
            dispatch({ type: 'UPLOAD_IMAGES', payload: array });
            firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set(array);
          }
        },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
      ],
      { cancelable: true }
    )
  }
}

export function updateAbout(value) {
  return function (dispatch) {
    dispatch({ type: 'ANIMAL_ADD', payload: value });
    setTimeout(function () {
      firebase.database().ref('cards/' + firebase.auth().currentUser.uid).update({ aboutMe: value });
    }, 3000);
  }

}
export function addAnimal(value, array) {
  return function (dispatch) {
    console.log(value);
    console.log(array);

    let newId = firebase.database().ref().child('animals').push().key;
    let newAnimal = {
      nome: value,
      id: newId,
    };
    //Caso seja o primeiro animal
    if (array == null) {
      array = [];
    }
    console.log(array);
    array.push(newAnimal)
    dispatch({ type: 'ANIMAL_ADD', payload: array });
    firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/animals').set(array);
  }
}
export function logout() {
  return function (dispatch) {
    firebase.auth().signOut()
    dispatch({ type: 'LOGOUT', loggedIn: false });
  }
}
export function getCards(geocode) {
  return function (dispatch) {
    firebase.database().ref('cards').orderByChild("geocode").equalTo(geocode).once('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        item = child.val();
        item.id = child.key;
        items.push(item);
      });
      dispatch({ type: 'GET_CARDS', payload: items });
    });
  }
}
    // ImagePicker.launchImageLibraryAsync({ allowsEditing: false }).then(function (result) {

    //   var array = images


    //   if (result.uri != undefined) {
    //     const file = {
    //       uri: result.uri,
    //       name: result.uri,
    //       type: "image/png"
    //     }

    //     const options = {
    //       keyPrefix: "uploads/",
    //       bucket: "petmez",
    //       region: "us-east-1",
    //       accessKey: aws.accessKey,
    //       secretKey: aws.secretKey,
    //       successActionStatus: 201
    //     }
    //     // console.log("array");
    //     // console.log(array);
    //     // console.log("result");
    //     // console.log(result);
    //     // console.log("file");
    //     // console.log(file);

    //     // if (!result.cancelled) {
    //     //   uploadUrl = await uploadImageAsync(result.uri);
    //     //   // this.setState({ image: uploadUrl });
    //     // }
    //     // // var uri = ""+ result.uri; 
    //     // // blob = image_namek
    //     // // const response = await fetch(uri);
    //     // // const blob = await response.blob();

    //     // var ref = firebase.storage().ref().child("images/" + "teste");
    //     // ref.put(file);
    //     dispatch({ type: 'UPLOAD_IMAGES', payload: array });
    //     // RNS3.put(file, options).then(function (response) {
    //     //   console.log(response.status);
    //     //   if (response.status === 201) {
    //     //     array.push(response.body.postResponse.location)
    //     //     firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set(array);
    //     //     dispatch({ type: 'UPLOAD_IMAGES', payload: array });
    //     //   }
    //     //   if (response.status === 400) {
    //     //     alert('Erro');
    //     //   }
    //     // })
    //   }

    // })

// uploadImage = async (uri, imageName) => {
//   const response = await fetch(uri);
//   const blob = await response.blob();

//   var ref = firebase.storage().ref().child("images/" + imageName);
//   return ref.put(blob);
// }
