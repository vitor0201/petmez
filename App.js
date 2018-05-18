import React from 'react';
import { View, Text } from 'react-native';
import Login from './screens/Login.js'
import reducers from './redux/reducers';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducers, middleware);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Login />
      </Provider>
    );
  }
}


// // import React, { Component } from 'react';
// // import TabNavigator from './navigation/TabNavigator.js'
// // import reducers from './redux/reducers';
// // import thunkMiddleware from 'redux-thunk';
// // import { Provider } from 'react-redux';
// // import { createStore, applyMiddleware } from 'redux';

// // const middleware = applyMiddleware(thunkMiddleware)
// // const store = createStore(reducers, middleware);

// // export default class App extends Component {
// //   render() {
// //     return (
// //       <Provider store={store}>
// //         <TabNavigator />
// //       </Provider>
// //     );
// //   }
// // }

// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View>
//         <Text>Open up App.js to start working on your app!</Text>

//       </View>
//     );
//   }
// }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// // });
