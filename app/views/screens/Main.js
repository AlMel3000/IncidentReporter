import {StyleSheet, View} from 'react-native';

import React, {Component} from 'react';


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

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }


    componentDidMount() {

    }


    componentWillUnmount() {

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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 16
    }
});

export default Main;

