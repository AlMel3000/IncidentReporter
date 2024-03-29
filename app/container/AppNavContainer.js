import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native'

import {StackNavigator} from 'react-navigation';

import colors from '../views/data/colors'

import Main from '../views/screens/Main'
import Splash from '../views/screens/Splash'
import Contacts from '../views/screens/Contacts'
import Image from '../views/screens/Image'


const TopLevelNavigator = StackNavigator(
    {
        Splash: {
            screen: Splash,
            navigationOptions: () => ({
                header: null
            })
        },
        Main: {
            screen: Main,
            navigationOptions: () => ({
                title: 'New Incident Report',
                headerTitleStyle: {alignSelf: 'center'},
                headerBackTitle: null,
                headerStyle: {backgroundColor: colors.lightGray}
            })
        },
        Contacts: {
            screen: Contacts,
            navigationOptions: () => ({
                title: 'Select User',
                headerTitleStyle: {alignSelf: 'center'},
                headerBackTitle: null,
                headerStyle: {backgroundColor: colors.lightGray}
            })
        },
        Image: {
            screen: Image,
            navigationOptions: () => ({
                title: 'View Photo',
                headerTitleStyle: {alignSelf: 'center'},
                headerBackTitle: null,
                headerStyle: {backgroundColor: colors.lightGray}
            })
        }
    }
    ,
    {headerMode: 'screen'}
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
