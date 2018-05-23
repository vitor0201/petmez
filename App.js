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