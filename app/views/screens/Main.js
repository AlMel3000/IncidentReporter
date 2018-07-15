import {Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import React, {Component} from 'react';

import colors from '../data/colors'

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

let ImagePicker = require('react-native-image-picker');

//todo replace with actual strings
let options = {
    title: 'Some text',
    noData: true,
    quality: 1,
    mediaType: 'photo',
    permissionDenied: {
        title: 'Some text',
        text: 'Some text'

    }
};

let geolocationPermissionsGranted = false;
const GEOLOCATION_REFRESH_RATE = 5000;

let recipientArray = [
    {
        name: 'Ian Shmidt',
        adress: 'ian_shmidt@mycompany.com'
    },
    {
        name: 'Maximilian von Gruber',
        adress: 'm_gruber@mycompany.com'
    }
];

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {};

    }


    componentDidMount() {
        this.startGeolocationUpdate();
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }

    startGeolocationUpdate() {
        this.findLocation();
        //to update location
        this.interval = setInterval(() => {
            this.findLocation();
        }, GEOLOCATION_REFRESH_RATE);
    }

    findLocation() {
        if (geolocationPermissionsGranted) {
            navigator.geolocation.getCurrentPosition(
                (geo_success) => {
                    console.warn(geo_success.coords.latitude, geo_success.coords.longitude, geo_success.coords.speed, geo_success.coords.altitude,)
                },
                (geo_error) => {
                    console.warn(geo_error);
                },
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 100}
            );
        } else {
            this.requestGeolocationPermission().then((result => {
                if (result) {
                    this.findLocation()
                }
            }));
        }
    }

    async requestGeolocationPermission() {
        try {
            geolocationPermissionsGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Incident Reporter App Geolocation Permission',
                    'message': 'Incident Reporter needs access to Geolocation ' +
                    'so you can submit detailed reports.'
                }
            );
            if (geolocationPermissionsGranted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the Geolocation");

                return geolocationPermissionsGranted

            } else {
                console.log("Geolocation permission denied");
                //to break location requests if user gave not permission
                clearInterval(this.interval);
                return false;
            }
        } catch (err) {
            console.warn(err)
        }
    }

    choosePhoto() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};
                console.warn('Image source: ', source);

                this.setState({
                    image: source
                });
            }
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    alignSelf: 'stretch',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        paddingVertical: 2
                    }}>
                        {recipientArray.map((recipient, index) => {
                            return (
                                <View
                                    key={index}>
                                    <Text style={styles.recipient_name}>{recipient.name}</Text>
                                </View>
                            )
                        })}
                    </View>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={(e) => this.props.navigation.navigate('Contacts')}>
                        <Image
                            source={require('../assets/account-multiple.png')}
                            style={{width: 28, height: 28}}/>
                    </TouchableOpacity>
                </View>


                <ActionButton buttonColor='black'>
                    <ActionButton.Item buttonColor='black' title="Camera" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-camera" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='black' title="Images" onPress={() => {}}>
                        <Icon name="md-images" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='black' title="Send report" onPress={() => {}}>
                        <Icon name="md-mail" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.lightGray,
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    recipient_name: {
        color: colors.textBlack,
        fontSize: 16,
        marginHorizontal: 8
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    }
});

export default Main;

