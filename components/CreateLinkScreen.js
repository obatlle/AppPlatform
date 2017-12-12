import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { getUser } from 'react-native-authentication-helpers';

import { graphql, gql } from 'react-apollo';

class CreateLinkScreen extends Component {

  state = {
    description: '',
    url: ''
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <TextInput
            value={this.state.description}
            onChangeText={(e) => this.setState({ description: e })}
            placeholder='A description for the link'
            type='text'
          />
          <TextInput
            value={this.state.url}
            onChangeText={(e) => this.setState({ url: e })}
            placeholder='The URL for the link'
            type='text'
          />
        </View>
        <Button title="Submit" onPress={() => this._createLink()}/>
      </View>
    )
  }

  _createLink = async () => {
    let user = getUser();
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const { description, url } = this.state
    await this.props.createLinkMutation({
      variables: {
        description,
        url,
        postedById: user.id,
      }
    })
    const { navigate } = this.props.navigation;
    navigate('Search')
  }
};

// 1
const CREATE_LINK_MUTATION = gql`
  # 2
  mutation CreateLinkMutation($description: String!, $url: String!, $postedById: ID!) {
    createLink(
      description: $description,
      url: $url,
      score: 0,
      postedById: $postedById
    ) {
      id
      createdAt
      url
      description
      score
      postedBy {
        id
        name
      }
    }
  }
`

// 3
export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLinkScreen)


const styles = StyleSheet.create({
  container: {
    marginTop: 200,
    height:200
  },
});
