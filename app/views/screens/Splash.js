import {StyleSheet, View} from 'react-native';

import React, {Component} from 'react';

import {NavigationActions, StackActions} from 'react-navigation';

import {Bubbles} from 'react-native-loader';


import colors from '../data/colors'


export default class Splash extends Component {


    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentDidMount() {
        this.doSomeTask();
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        this.stopTasks();
        this.navigateTo('Main');
    }


    //as for me the only reason for splashscreen relative to react-native is to do some preparation (for example light-weight API request etc)
    //In one of the project I've provided dinamic localization of the app with timeout
    doSomeTask() {
        //task mock
        this.timer = setTimeout(() => {
            this.navigateTo('Main');
        }, 1500);
    }

    stopTasks() {

    }

    navigateTo(routename) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: routename})],
        });
        this.props.navigation.dispatch(resetAction);
    }


    render() {
        return (
            <View style={styles.container}>
                <Bubbles size={16} color='blue'/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


