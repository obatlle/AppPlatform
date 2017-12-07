import React, { Component } from 'react';
import { connect } from 'redux-zero/react';
import { StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import actions from '../app/actions';

import getNavigationParam from '../utils/getNavigationParam';

const mapToProps = ({ count }) => ({ count });

class LinksScreen extends Component {
  render() {

    const { navigate } = this.props.navigation;

    const { count, increment, decrement } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.counter}>
          { count }
        </Text>
        <TouchableHighlight onPress={()=> navigate('Authentication')}>
          <Text style={styles.counter}>
            Initial screen
          </Text>
        </TouchableHighlight>
        <Button title="+" onPress={increment} />
        <Button title="-" onPress={decrement} />
      </View>
    );
  }
}

export default connect(mapToProps, actions)(LinksScreen);

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
