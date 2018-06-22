import React from 'react';
import styles from '../styles'
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { getCards } from '../redux/actions'
import SwipeCards from 'react-native-swipe-cards'
import Cards from '../components/Cards.js'
import NoCards from '../components/NoCards.js'

import {
  Text,
  View,
  Image
} from 'react-native';

class Home extends React.Component {

  componentWillMount() {
    this.props.dispatch(getCards(this.props.user.geocode))
  }

  handleYup(card) {
    firebase.database().ref('cards/' + this.props.user.id + '/swipes').update({ [card.id]: true });
    this.checkMatch(card)
  }

  handleNope(card) {
    firebase.database().ref('cards/' + this.props.user.id + '/swipes').update({ [card.id]: false });
  }

  checkMatch(card) {
    firebase.database().ref('cards/' + card.id + '/swipes/' + this.props.user.id).once('value', (snap) => {
      if (snap.val() == true) {
        var me = {
          id: this.props.user.id,
          photoUrl: this.props.user.photoUrl,
          name: this.props.user.name
        }
        var user = {
          id: card.id,
          photoUrl: card.photoUrl,
          name: card.name
        }
        firebase.database().ref('cards/' + this.props.user.id + '/chats/' + card.id).set({ user: user });
        firebase.database().ref('cards/' + card.id + '/chats/' + this.props.user.id).set({ user: me });
      }
    });
  }
  // <SwipeCards
  //   cards={this.props.cards}
  //   stack={false}
  //   renderCard={(cardData) => <Cards {...cardData} />}
  //   renderNoMoreCards={() => <NoCards />}
  //   showYup={false}
  //   showNope={false}
  //   handleYup={this.handleYup.bind(this)}
  //   handleNope={this.handleNope.bind(this)}
  //   handleMaybe={this.handleMaybe}
  //   hasMaybeAction={false} />

  render() {
    console.log(this.props.cardsAnimals);
    console.log(this.props.cards);

    return (
      <SwipeCards
        cards={this.props.cardsAnimals}
        stack={false}
        renderCard={(cardData) => <Cards {...cardData} />}
        renderNoMoreCards={() => <NoCards />}
        showYup={false}
        showNope={false}
        handleYup={this.handleYup.bind(this)}
        handleNope={this.handleNope.bind(this)}
        handleMaybe={this.handleMaybe}
        hasMaybeAction={false} />
    )
  }
}

function mapStateToProps(state) {
  return {
    cards: state.cards,
    cardsAnimals: state.cardsAnimals,
    user: state.user
  };
}

export default connect(mapStateToProps)(Home);