import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight , Dimensions, TextInput, Image} from 'react-native';

import MapView from 'react-native-maps'

const { width, height } = Dimensions.get('window');

const customStyle = [
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e0efef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
];
const ASPECT_RATIO = width / height;
const LATITUDE = 41.3818;
const LONGITUDE = 2.1685;
const LATITUDE_DELTA = 2.2;
const LONGITUDE_DELTA = 2.2;


class LinksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
      <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.map}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
          customMapStyle={customStyle}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        />
        <View style={styles.profileSearchContainer}>
          <View style={styles.profileSearchAlign}>
            <Image
              style={styles.profileView}
              source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
            />
            <View style={styles.searchView}>
              <TextInput
                style={styles.searchText}
                placeholder='Where to?'
                placeholderTextColor ='#E7E7E7'
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
              />
            </View>
          </View>
        </View>
        <TouchableHighlight style={styles.addTripContainer} underlayColor='rgba(52, 52, 52, 0.8)' onPress={()=> navigate('Search')}>
          <View style={styles.addTripAlign}>
            <Text style={styles.addTripText}>Post a trip</Text>
            <View style={styles.addTripView}>
              <Text style={styles.addTripSymbol}>+</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default LinksScreen;

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
  map: {
    width: width,
    height: height+80,
  },
  profileSearchContainer:{
    position: 'absolute',
    width:width,
    top: 80,
  },
  profileSearchAlign:{
    flex:1,
    flexDirection: 'row',
  },
  profileView: {
        width: 50,
        height: 50,
        left:20,
        borderRadius:25,
        overflow: 'hidden',
        borderColor: 'white',
        borderWidth: 3,
    },
  searchView: {
        width: width-100,
        height: 50,
        left: 30,
        borderRadius:25,
        overflow: 'hidden',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    searchText:{
      marginTop:10,
      fontSize: 24,
      textAlign: 'right',
      right: 16,
      fontWeight: 'normal' ,
      color: '#979797'
    },
    addTripContainer: {
          position: 'absolute',
          top: height-100,
          right: 30,
      },
      addTripAlign: {
        flex:1,
        flexDirection: 'row'
      },
      addTripText: {
        marginTop: 16 ,
        right: 8,
        fontSize: 18,
        fontWeight: 'bold' ,
        color: '#5D287F'
      },
    addTripView: {
          width: 58,
          height: 58,
          borderRadius:29,
          overflow: 'hidden',
          backgroundColor: '#5D287F',
      },
      addTripSymbol: {
        marginTop: 4 ,
        textAlign:'center',
        fontSize: 36,
        fontWeight: 'normal' ,
        color: '#7dcdcd'
      },
});
