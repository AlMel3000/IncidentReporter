import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native'

import {StackNavigator} from 'react-navigation';

import colors from '../views/data/colors'

import Main from '../views/screens/Main'


const TopLevelNavigator = StackNavigator(
    {
        Main: {screen: Main}
    },
    {headerMode: 'none'}
);


export default class AppNavContainer extends Component {


    render() {
        return (
            <View style={styles.container}>
                <TopLevelNavigator/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    }
});
