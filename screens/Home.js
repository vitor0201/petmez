import React from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { getCards, match } from '../redux/actions';
import SwipeCards from 'react-native-swipe-cards';
import Cards from '../components/Cards.js';
import NoCards from '../components/NoCards';

class Home extends React.Component {

  componentWillMount() {
    this.didFocusListener = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.props.dispatch(getCards(this.props.user));
      }
    );
  }

  componentWillUnmount() {
    this.didFocusListener.remove();
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
    const me = {
      id: this.props.user.id,
      photoUrl: this.props.user.photoUrl,
      name: this.props.user.name
    };
    const user = {
      id: card.userId,
      photoUrl: card.imgUri[0],
      name: card.nome
    };
    firebase
      .database()
      .ref("cards/" + this.props.user.id + "/chats/" + card.userId)
      .set({ user: user });
    firebase
      .database()
      .ref("cards/" + card.userId + "/chats/" + this.props.user.id)
      .set({ user: me });
  }

  render() {
    return (
      <SwipeCards
        cards={this.props.cardsAnimals}
        stack={false}
        renderCard={cardData => <Cards {...cardData} />}
        renderNoMoreCards={() => <NoCards />}
        showYup={true}
        yupText="Quero Adotar"
        nopeText="Nope"
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
