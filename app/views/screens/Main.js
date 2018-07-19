import {
    Image,
    ListView,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import React, {Component} from 'react';

import colors from '../data/colors'
import BlockHeader from '../ui_elements/BlockHeader'

import Mailer from 'react-native-mail';


import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import CardView from 'react-native-cardview'

import {Bubbles} from 'react-native-loader';
import {NavigationActions, StackActions} from "react-navigation";

let ImagePicker = require('react-native-image-picker');


let options = {
    title: 'Image',
    noData: true,
    quality: 1,
    mediaType: 'photo',
    permissionDenied: {
        title: 'Permission denied.',
        text: 'Please allow access in application`s settingst'

    }
};

let imagesArray = [];

let geolocationPermissionsGranted = false;
const GEOLOCATION_REFRESH_DISTANCE_FILTER = 1;

let watchID = null;

class Main extends Component {

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            locationReceived: false,
            description: '',
            descriptionBorderColor: 'transparent',
            dataSource: ds.cloneWithRows(imagesArray),
        };

    }


    componentDidMount() {
        this.startGeolocationUpdate();
    }


    componentWillUnmount() {
        if (watchID !== null) {
            navigator.geolocation.clearWatch(watchID);
        }

    }

    startGeolocationUpdate() {
        this.findLocation();
    }

    findLocation() {
        if (geolocationPermissionsGranted) {
            navigator.geolocation.getCurrentPosition(
                (success) => {
                    console.warn('MAIN findLocation', success.coords.latitude, success.coords.longitude, success.coords.speed, success.coords.altitude,);
                    this.updatePositionValues(success);
                    //to update location (more battery consumption but configurable)
                    this.startObservingGeolocation();
                },
                (error) => {
                    console.warn('MAIN findLocation error', error);
                },
                {enableHighAccuracy: false, timeout: 120000}
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
            if (Platform.OS === 'ios') {
                return true;
            } else {
                geolocationPermissionsGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Incident Reporter App Geolocation Permission',
                        'message': 'Incident Reporter needs access to Geolocation ' +
                        'so you can submit detailed reports.'
                    }
                );
                if (geolocationPermissionsGranted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("MAIN findLocation You can use the Geolocation");

                    return geolocationPermissionsGranted

                } else {
                    console.log("MAIN findLocation Geolocation permission denied");
                    //to break location requests if user gave not permission
                    clearInterval(this.interval);
                    return false;
                }
            }
        } catch (err) {
            console.warn('MAIN findLocation requestGeolocation Permission error', err)
        }
    }

    startObservingGeolocation() {
        watchID = navigator.geolocation.watchPosition((lastPosition) => {
                this.updatePositionValues(lastPosition);
            },
            (error) => console.warn('MAIN findLocation startObservingGeolocation error', error),
            {
                enableHighAccuracy: true,
                timeout: 120000,
                maximumAge: 100,
                distanceFilter: GEOLOCATION_REFRESH_DISTANCE_FILTER
            });

    }

    updatePositionValues(geo) {
        this.setState({
            latitude: Main.roundNumber(geo.coords.latitude, 2),
            longitude: Main.roundNumber(geo.coords.longitude, 2),
            speed: Main.roundNumber(geo.coords.speed, 0),
            //precise values for letter
            preciseLatitude: geo.coords.latitude,
            preciseLongitude: geo.coords.longitude,
            preciseSpeed: geo.coords.speed,
            preciseAltitude: geo.coords.altitude,
            locationReceived: true
        })
    }

    static roundNumber(number, numbersAfterComma) {
        let num = Number(number);
        return num.toFixed(numbersAfterComma);
    }

    choosePhoto() {
        ImagePicker.launchImageLibrary(options, (response) => {
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
                let path = {path: response.path};
                imagesArray.push([source, path]);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(imagesArray),
                });
                console.warn('Image source: ', imagesArray);
            }
        });
    }

    pickPhoto() {
        ImagePicker.launchCamera(options, (response) => {
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
                let path = {path: response.path};
                imagesArray.push([source, path]);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(imagesArray),
                });
                console.warn('Image source: ', imagesArray);

            }
        });
    }


    onChangeDescription(text) {
        this.setState({
            description: text,
            descriptionBorderColor: 'transparent'
        })
    }

    sendReport() {
        if (this.state.description.trim().length < 2) {
            this.setState({
                descriptionBorderColor: 'red'
            })
        } else {

            let mailBody;
            if (this.state.locationReceived) {
                mailBody = 'Location\n\nLatitude: ' + this.state.preciseLatitude + '\nLongitude: ' + this.state.preciseLongitude + '\nAltitude:  ' + this.state.preciseAltitude + '\nSpeed: ' + this.state.preciseSpeed + '\n\n\nDescription\n\n ' + this.state.description;
            } else {
                mailBody = 'Description{\n\n}' + this.state.description;
            }

            let recipients = null;

            if (this.props.navigation.getParam('contacts', null)) {
                if (imagesArray.length > 0) {
                    Mailer.mail({
                        subject: 'Incident report',
                        recipients: this.props.navigation.getParam('contacts', null).map((recipient) => {
                            return recipient.email
                        }),
                        body: mailBody,
                        isHTML: false,
                        attachment: {
                            path: imagesArray[0][1].path,
                            type: 'image/jpg',
                        }


                    }, (error, event) => {
                        Alert.alert(
                            error,
                            event,
                            [
                                {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
                                {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
                            ],
                            {cancelable: true}
                        )
                    });
                } else {
                    Mailer.mail({
                        subject: 'Incident report',
                        recipients: this.props.navigation.getParam('contacts', null).map((recipient) => {
                            return recipient.email
                        }),
                        body: mailBody,
                        isHTML: false,
                    }, (error, event) => {
                        Alert.alert(
                            error,
                            event,
                            [
                                {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
                                {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
                            ],
                            {cancelable: true}
                        )
                    });
                }


            } else {
                if (imagesArray.length > 0) {
                    Mailer.mail({
                        subject: 'Incident report',
                        body: mailBody,
                        isHTML: false,
                        attachment: {
                            path: imagesArray[0][1].path,
                            type: 'image/jpg',
                        }


                    }, (error, event) => {
                        Alert.alert(
                            error,
                            event,
                            [
                                {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
                                {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
                            ],
                            {cancelable: true}
                        )
                    });
                } else {
                    Mailer.mail({
                        subject: 'Incident report',
                        body: mailBody,
                        isHTML: false,
                    }, (error, event) => {
                        Alert.alert(
                            error,
                            event,
                            [
                                {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
                                {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
                            ],
                            {cancelable: true}
                        )
                    });
                }
            }
        }

    }

    removeImage(data) {
        let index = imagesArray.indexOf(data);
        if (index > -1) {
            imagesArray.splice(index, 1);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(imagesArray)
            });
        }
    }

    clearReport() {
        imagesArray.length = 0;
        this.setState({
            description: '',
            descriptionBorderColor: 'transparent',
            dataSource: this.state.dataSource.cloneWithRows(imagesArray)
        });
        this.clearNavigationProps();
    }

    clearNavigationProps() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Main'})],
        });
        this.props.navigation.dispatch(resetAction);
    }



    renderRow(rowData, sectionID: string, rowID: string) {
        if (!rowData) {
            return null;
        } else {
            return (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 8
                    }}>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 8
                        }}
                        onPress={(e) => this.props.navigation.navigate('Image', {
                            imageSource: rowData[0]
                        })}>
                        <Image source={rowData[0]} style={{height: 64, width: 64, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            right: 2,
                            top: 2
                        }}
                        onPress={(e) => this.removeImage(rowData)}>
                        <Icon
                            name="md-trash"
                            style={{
                                fontSize: 20,
                                height: 22,
                                color: 'black'
                            }}/>
                    </TouchableOpacity>
                </View>
            );
        }

    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: colors.lightGray,
                    paddingVertical: 8,
                    paddingHorizontal: 8
                }}>
                <ScrollView
                    style={styles.container}
                    keyboardShouldPersistTaps='handled'>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            alignSelf: 'stretch'
                        }}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                paddingVertical: 2
                            }}>
                            {this.props.navigation.getParam('contacts', null) && this.props.navigation.getParam('contacts', null).map((recipient, index) => {
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

                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={2}
                        style={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginVertical: 8,
                            alignSelf: 'stretch',
                            backgroundColor: colors.lightGray
                        }}>

                        <BlockHeader blockHeaderText={'Position details'}/>
                        {this.state.locationReceived &&
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                alignSelf: 'stretch'
                            }}>

                            <Text
                                style={{
                                    color: colors.textBlack,
                                    fontSize: 18,
                                    margin: 8
                                }}>
                                {"Lat: " + this.state.latitude}
                            </Text>

                            <Text
                                style={{
                                    color: colors.textBlack,
                                    fontSize: 18,
                                    margin: 8
                                }}>
                                {"Lon: " + this.state.longitude}
                            </Text>

                            <Text
                                style={{
                                    color: colors.textBlack,
                                    fontSize: 18,
                                    margin: 8
                                }}>
                                {"Speed: " + this.state.speed}
                            </Text>

                        </View>}
                        {!this.state.locationReceived &&
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'stretch',
                                padding: 8
                            }}>
                            <Bubbles size={8} color={colors.intenseGray}/>
                        </View>}
                        <BlockHeader blockHeaderText={'Description'}/>

                        <TextInput
                            style={{
                                height: 120,
                                color: colors.textDark,
                                alignSelf: 'stretch',
                                fontSize: 14,
                                backgroundColor: colors.light,
                                marginBottom: 16,
                                marginHorizontal: 8,
                                borderWidth: 1,
                                borderColor: this.state.descriptionBorderColor,
                            }}
                            autoFocus={false}
                            multiline={true}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => this.onChangeDescription(text)}
                            value={this.state.description}/>
                    </CardView>
                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={2}
                        style={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            alignSelf: 'stretch',
                            marginBottom: 8,
                            backgroundColor: colors.lightGray
                        }}>

                        <BlockHeader blockHeaderText={'Photos'}/>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                alignSelf: 'stretch',
                                backgroundColor: colors.light,
                                height: 120,
                                marginBottom: 16,
                                marginHorizontal: 8,
                            }}>
                            <ScrollView horizontal={true}>
                                <ListView
                                    contentContainerStyle={{flexDirection: 'row'}}
                                    dataSource={this.state.dataSource}
                                    renderRow={this.renderRow.bind(this)}
                                />
                            </ScrollView>
                        </View>
                    </CardView>
                </ScrollView>

                <ActionButton buttonColor='black'>
                    <ActionButton.Item buttonColor='black' title="Camera" onPress={(e) => {
                        this.pickPhoto(e)
                    }}>
                        <Icon name="md-camera" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='black' title="Images" onPress={(e) => {
                        this.choosePhoto(e)
                    }}>
                        <Icon name="md-images" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='black' title="Send report" onPress={(e) => {
                        this.sendReport(e)
                    }}>
                        <Icon name="md-mail" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='black' title="Clear report" onPress={(e) => {
                        this.clearReport(e)
                    }}>
                        <Icon name="md-trash" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                </ActionButton>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch'
    },
    recipient_name: {
        color: colors.textBlack,
        fontSize: 16,
        marginHorizontal: 8
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: colors.light
    }
});

export default Main;

