import React, { Component } from 'react';
import { connect } from 'redux-zero/react';
import { StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import actions from '../app/actions';


import LinkList from './LinkList'

const mapToProps = ({ count }) => ({ count });

class AuthenticationScreen extends Component {
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
            <Text >Post a new Link</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default connect(mapToProps, actions)(AuthenticationScreen);

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
