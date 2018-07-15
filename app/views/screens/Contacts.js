import {StyleSheet, View} from 'react-native';

import React, {Component} from 'react';

import {NavigationActions, StackActions} from 'react-navigation';

import colors from '../data/colors'


export default class Contacts extends Component {


    componentDidMount() {
    }


    backToMain() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Main'})],
        });
        this.props.navigation.dispatch(resetAction);
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
        backgroundColor: colors.lightGray,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


