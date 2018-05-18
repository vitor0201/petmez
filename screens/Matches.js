import React from 'react';
import styles from '../styles';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import { 
  Text, 
  View,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

class Matches extends React.Component {
  state = {
    chats: []
  }

  componentWillMount() {
    firebase.database().ref('cards/' + this.props.user.id + '/chats').on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        item = child.val();
        items.push(item); 
      });
      this.setState({ chats: items.reverse() });
    });
  }

  render() {
    return (
     <View style={styles.container} >
      <ScrollView>
        {this.state.chats.map((uri)=>{
          return (
            <TouchableOpacity style={[styles.imgRow, styles.border]} onPress={() => this.props.navigation.navigate("Chat", {user: uri.user})} >
              <Image style={styles.img} source={{uri: uri.user.photoUrl}} />
              <Text style={styles.bold}>{uri.user.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
     </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Matches);