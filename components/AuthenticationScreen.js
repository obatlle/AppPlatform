import React, { Component } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View ,  Alert, Share, AsyncStorage } from 'react-native';
import Button from 'react-native-platform-button';
import { setUser } from 'react-native-authentication-helpers';
import { gql, graphql, compose } from 'react-apollo';

import { Constants, Facebook, Google } from 'expo';


import Colors from '../constants/Colors';
import StyledTextInput from './StyledTextInput';



function inSignUpState(navigationState) {
  return !!(navigationState.params && navigationState.params.signUp);
}

class AuthenticationScreen extends Component {



  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let onSubmitPress = params ? params.onSubmitPress : () => {};

    return {
      title: inSignUpState(navigation.state) ? 'Sign Up' : 'Sign In',
      headerRight: Platform.OS === 'ios' && (
        <Button
          fontSize={17}
          color="#fff"
          title="Submit"
          onPress={onSubmitPress}
        />
      ),
    };
  };


  state = {
    email: '',
    password: '',
    name: '',
    profilePicture: null,
  };

  _handleFacebookLogin = async () => {
    const { type, token, expires } = await Facebook.logInWithReadPermissionsAsync(
      '1201211719949057', // Replace with your own app id in standalone app
      { permissions: ['public_profile', 'email', 'user_friends'] }
    );
    console.log(type);
    console.log(token);
    console.log(expires);
    switch (type) {
      case 'success': {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,first_name,last_name,picture,gender,email&access_token=${token}`);
        const profile = await response.json();

        this.setState({
          name: profile.first_name +' '+ profile.last_name,
          email: profile.email,
          password: token,
          profilePicture: profile.picture.data.url });

        this._storeAuthTokensLocally( token, 'facebook' );
        console.log('Token'+token);
        const { name, email, password } = this.state;
        const result = await this.props.createUserMutation({
          variables: {
            name,
            email,
            password,
          },
        })
        const id = result.data.signinUser.user.id;
        console.log(id)
        const token_cool = result.data.signinUser.token;
        console.log(token_cool)
        this._saveUserData(id, token_cool);

        this.setState({
          password:''
        });

        const { navigate } = this.props.navigation;
        navigate('Search');

        //this._updateUserProfile();
        break;
      }
      case 'cancel': {
        Alert.alert( 'Cancelled!', 'Login was cancelled!' );
        break;
      }
      default: {
        Alert.alert( 'Error', 'Facebook login returned error.' );
      }
    }
  }

  _handleGoogleLogin = async () => {
    const { type, user, idToken, refreshToken } = await Google.logInAsync({
      androidStandaloneAppClientId: '<ANDROID_CLIENT_ID>',
      iosStandaloneAppClientId: '<IOS_CLIENT_ID>',
      androidClientId: '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
      iosClientId: '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',
      scopes: ['profile', 'email']
    });

    switch (type) {
      case 'success': {
        this.setState({
          name: user.givenName +' '+ user.familyName,
          email: user.email,
          password: idToken,
          profilePicture: user.photoUrl });


          this._storeAuthTokensLocally( idToken, 'google' );
          console.log('Token'+idToken);
          const { name, email, password } = this.state;
          const result = await this.props.createUserMutation({
            variables: {
              name,
              email,
              password,
            },
          })
          const id = result.data.signinUser.user.id;
          console.log(id)
          const token_cool = result.data.signinUser.token;
          console.log(token_cool)
          this._saveUserData(id, token_cool);

          this.setState({
            password:''
          });

          const { navigate } = this.props.navigation;
          navigate('Search');
        //this._updateUserProfile();
        break;
      }
      case 'cancel': {
        Alert.alert( 'Cancelled!', 'Login was cancelled!' );
        break;
      }
      default: {
        Alert.alert( 'Error', 'Google login returned error.' );
      }
    }
  }

  _storeAuthTokensLocally = async (  socialLoginToken, network ) => {
    try {
      await AsyncStorage.setItem('socialLoginToken', socialLoginToken);
    } catch (error) {
      // Error saving data
      console.log('Error saving socialLoginToken: '+socialLoginToken)
    }
    try {
      await AsyncStorage.setItem('socialNetwork', network);
    } catch (error) {
      // Error saving data
      console.log('Error saving socialNetwork: '+network)
    }
  }

  _haveSocialToken = async () => {
    try {
      const haveToken = await AsyncStorage.getItem('socialLoginToken');
      if (haveToken !== null){
        // We have data!!
        console.log(haveToken);
        try {
          const network = await AsyncStorage.getItem('socialNetwork');
          if (network !== null){
            // We have data!!
            console.log(network);
            if (network == 'facebook'){
              const response = await fetch(`https://graph.facebook.com/me?fields=id,first_name,last_name,picture,gender,email&access_token=${haveToken}`);
              const profile = await response.json();
              console.log(profile)
              const { navigate } = this.props.navigation;
              navigate('Search');

            }else{
              //Don't support memorizing the Google login token yet
            }
          }
        } catch (error) {
          // Error retrieving data
        }
      }
    } catch (error) {
      // Error retrieving data
    }

  }

  componentWillMount() {
    this._haveSocialToken();

    this.props.navigation.setParams({
      onSubmitPress: this._confirm,
    });

  }

  render() {
    let showSignUpForm = inSignUpState(this.props.navigation.state);


    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <View style={styles.formInputGroup}>
          {showSignUpForm && (
            <StyledTextInput
              autoFocus={true}
              onChangeText={name => this.setState({ name })}
              onSubmitEditing={() => this._emailInput.focus()}
              type="text"
              placeholder="Your name"
              value={this.state.name}
            />
          )}
          <StyledTextInput
            autoCapitalize="none"
            autoFocus={true}
            ref={view => {
              this._emailInput = view;
            }}
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            onSubmitEditing={() => this._passwordInput.focus()}
            type="text"
            placeholder="Your email address"
          />
          <StyledTextInput
            lastStyledTextInputInGroup={true}
            returnKeyType="go"
            ref={view => {
              this._passwordInput = view;
            }}
            onChangeText={password => this.setState({ password })}
            onSubmitEditing={this._confirm}
            secureTextEntry={true}
            type="password"
            placeholder={showSignUpForm ? 'Choose a safe password' : 'Password'}
            value={this.state.password}
          />
        </View>

        <View style={styles.buttonGroup}>
          {Platform.OS === 'android' && (
            <Button
              color="#000"
              onPress={this._confirm}
              title={showSignUpForm ? 'Create account' : 'Login'}
            />
          )}
          <View style={styles.buttonSeparator} />
          <Button
            color={Platform.OS === 'android' ? '#000' : Colors.orange}
            onPress={() =>
              this.props.navigation.setParams({ signUp: !showSignUpForm })}
            title={
              showSignUpForm
                ? 'Already have an account?'
                : 'Need to create an account?'
            }
          />
          <Button
            title="Login with Facebook"
            onPress={() => this._handleFacebookLogin()}
          />
          <Button
            title="Login with Google"
            onPress={() => this._handleGoogleLogin()}
          />
        </View>
      </ScrollView>
    );
  }

  _confirm = async () => {
    const signUp = inSignUpState(this.props.navigation.state);
    const { name, email, password } = this.state;
    if (!email || !password || (signUp && !name)) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (signUp) {
        const result = await this.props.createUserMutation({
          variables: {
            name,
            email,
            password,
          },
        });
        const id = result.data.signinUser.user.id;
        const token = result.data.signinUser.token;
        this._saveUserData(id, token);
      } else {
        const result = await this.props.signinUserMutation({
          variables: {
            email,
            password,
          },
        });
        const id = result.data.signinUser.user.id;
        const token = result.data.signinUser.token;
        this._saveUserData(id, token);
      }

      this.props.navigation.goBack();
    } catch (e) {
      alert(e.message);
    }
  };

  _saveUserData = (id, token) => {
    setUser({ id, token });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formInputGroup: {
    marginBottom: 5,
    marginTop: 10,
  },
  buttonGroup: {
    marginHorizontal: 10,
  },
  buttonSeparator: {
    marginBottom: Platform.OS === 'android' ? 10 : 0,
  },
});

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      name: $name
      authProvider: { email: { email: $email, password: $password } }
    ) {
      id
    }
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        id
      }
    }
  }
`;

const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        id
      }
    }
  }
`;


export default compose(
  graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
  graphql(SIGNIN_USER_MUTATION, { name: 'signinUserMutation' })
)(AuthenticationScreen);
