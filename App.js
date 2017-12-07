import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from "redux-zero/react";
import Onion from './Onion';
import store from './app/store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Onion />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
