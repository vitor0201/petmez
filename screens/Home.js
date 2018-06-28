import React from "react";
import styles from "../styles";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { getCards, match } from "../redux/actions";
import SwipeCards from "react-native-swipe-cards";
import Cards from "../components/Cards.js";
import NoCards from "../components/NoCards.js";

import { Text, View, Image } from "react-native";

class Home extends React.Component {
  componentWillUnmount() {
    this.didFocusListener.remove();
  }

  // componentDidMount() {
  //   this.didFocusListener.remove();
  // }
  componentWillMount() {
    this.didFocusListener = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.props.dispatch(getCards(this.props.user));
      }
    );
  }

  handleYup(card) {
    card.match = true;
    firebase
      .database()
      .ref("cards/" + this.props.user.id + "/swipes")
      .update({ [card.id]: card });
    console.log(this.props.user);
    this.props.dispatch(match(card.id, this.props.user));
    this.checkMatch(card);
  }

  handleNope(card) {
    firebase
      .database()
      .ref("cards/" + this.props.user.id + "/swipes")
      .update({ [card.id]: false });
  }

  checkMatch(card) {
    console.log(this.props)
    var me = {
      id: this.props.user.id,
      photoUrl: this.props.user.photoUrl,
      name: this.props.user.name
    };
    var user = {
      id: card.userId,
      photoUrl: card.imgUri[0],
      name: card.nome
    };
    firebase.database().ref('cards/' + this.props.user.id + '/chats/' + card.id ).set({ user: user });
    firebase.database().ref('cards/' + card.userId + '/chats/' + this.props.user.id).set({ user: me });


  render() {
    return (
      <SwipeCards
        cards={this.props.cardsAnimals}
        stack={false}
        renderCard={cardData => <Cards {...cardData} />}
        renderNoMoreCards={() => <NoCards />}
        showYup={false}
        showNope={false}
        handleYup={this.handleYup.bind(this)}
        handleNope={this.handleNope.bind(this)}
        handleMaybe={this.handleMaybe}
        hasMaybeAction={false}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    cards: state.cards,
    cardsAnimals: state.cardsAnimals,
    match: state.user.match,
    user: state.user
  };
}

export default connect(mapStateToProps)(Home);
