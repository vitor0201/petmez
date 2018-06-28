export default (reducers = (
  state = {
    loggedIn: false,
    cards: [],
    cardsAnimals: [],
    user: {
      id: "",
      photoUrl: "",
      name: "",
      aboutMe: " ",
      matches:[],
      filtre: "todos",
      chats: " ",
      geocode: " ",
      images: [],
      notification: false,
      show: false,
      report: false,
      swipes: [],
      animals: [],
      token: " "
    }
  },
  action
) => {
  switch (action.type) {
    case "LOGIN": {
      return { ...state, user: action.user, loggedIn: action.loggedIn };
    }
    case "MATCH_CARD": {
      return{...state, user: { ...state.user, matches: action.payload }}
    }
    case "FILTER_UPDATE": {
      return { ...state,  user: { ...state.user, filter: action.payload } };
    }
    case "UPLOAD_IMAGES": {
      return { ...state, user: { ...state.user, images: action.payload } };
    }
    case "ANIMAL_ADD": {
      return { ...state, user: { ...state.user, animals: action.payload } };
    }
    case "UPDATE_ABOUT":
      return {
        ...state,
        user: { ...state.user, aboutMe: action.payload }
      };
    case "LOGOUT": {
      return { ...state, loggedIn: action.loggedIn };
    }
    case "GET_CARDS": {
      return { ...state, cardsAnimals: action.payload };
    }
    case "GET_LOCATION": {
      return { ...state, user: { ...state.user, geocode: action.payload } };
    }
    case "ALLOW_NOTIFICATION": {
      return { ...state, user: { ...state.user, token: action.payload } };
    }
  }
  return state;
});
