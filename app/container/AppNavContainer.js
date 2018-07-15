import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native'

import {StackNavigator} from 'react-navigation';

import colors from '../views/data/colors'

import Main from '../views/screens/Main'
import Splash from '../views/screens/Splash'
import Contacts from '../views/screens/Contacts'


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
                title: 'Some text',
                headerTitleStyle: {alignSelf: 'center'},
                headerBackTitle: null,
                headerStyle: {backgroundColor: colors.lightGray}
            })
        },
        Contacts: {
            screen: Contacts,
            navigationOptions: () => ({
                title: 'Some text',
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
