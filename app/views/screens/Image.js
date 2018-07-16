import {Image, StyleSheet, View} from 'react-native';

import React, {Component} from 'react';

import colors from '../data/colors'


export default class Contacts extends Component {


    componentDidMount() {
    }


    render() {
        return (
            <View style={styles.container}>
                <Image source={this.props.navigation.getParam('imageSource', null)}
                       style={{flex: 1, alignSelf: 'stretch', resizeMode: 'contain'}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    }
});


