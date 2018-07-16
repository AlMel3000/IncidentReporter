import {
    Image,
    ListView,
    PermissionsAndroid,
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
const GEOLOCATION_REFRESH_RATE = 5000;

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
                    console.warn(geo_success.coords.latitude, geo_success.coords.longitude, geo_success.coords.speed, geo_success.coords.altitude,);
                    this.setState({
                        latitude: Main.roundNumber(geo_success.coords.latitude, 2),
                        longitude: Main.roundNumber(geo_success.coords.longitude, 2),
                        speed: Main.roundNumber(geo_success.coords.speed, 0),
                        locationReceived: true
                    })
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
            if (this.props.navigation.getParam('contacts', null)) {

                if (imagesArray.length > 0) {
                    Mailer.mail({
                        subject: 'Incident report',
                        recipients: this.props.navigation.getParam('contacts', null).map((recipient) => {
                            return recipient.email
                        }),
                        body: this.state.description,
                        isHTML: true,
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
                        body: this.state.description,
                        isHTML: true,
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
                dataSource: this.state.dataSource.cloneWithRows(imagesArray),
            });
        }
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

