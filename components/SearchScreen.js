import React, { Component } from 'react';
import { connect } from 'redux-zero/react';
import { StyleSheet, Text, View, Button, TouchableHighlight, Alert,AsyncStorage } from 'react-native';
import actions from '../app/actions';

import { withUser, clearUser } from 'react-native-authentication-helpers';

import LinkList from './LinkList'

const mapToProps = ({ count }) => ({ count });


function promptSignOut() {
  Alert.alert(
    'Confirm',
    'Are you sure you want to sign out?',
    [
      { text: 'Sign out', onPress: clearUser },
      { text: 'Cancel', style: 'cancel' },
    ],
    { cancelable: true }
  );
}

class SearchScreen extends Component {
  _removeAsyncStorage = async ( ) => {
    try {
      await AsyncStorage.removeItem('socialLoginToken');
      await AsyncStorage.removeItem('socialNetwork');
    } catch (error) {
      // Error saving data
      console.log('Error removing socialLoginToken')
    }
  }

  render() {

    const { navigate } = this.props.navigation;

    const { count, increment, decrement } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.counter}>
          { count }
        </Text>
        <Button title="+" onPress={increment} />
        <Button title="-" onPress={decrement} />
        <LinkList />
        <TouchableHighlight underlayColor='rgba(52, 52, 52, 0.8)' onPress={()=> navigate('CreateLink')}>
          <View>
            <Text >Post a new Link from here</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='rgba(52, 52, 52, 0.8)' onPress={()=> navigate('Authentication')}>
          <View>
            <Text >Login</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor='rgba(52, 52, 52, 0.8)' onPress={()=> {promptSignOut(); this._removeAsyncStorage()}}>
          <View>
            <Text >logout</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default connect(mapToProps, actions)(SearchScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  counter: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
