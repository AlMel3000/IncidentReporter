import {CheckBox, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import React, {Component} from 'react';

import {NavigationActions, StackActions} from 'react-navigation';

import colors from '../data/colors'

let recipientArray = require('../data/mock_recipients');

export default class Contacts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checkBox1: false,
            checkBox2: false
        };

    }

    componentDidMount() {
    }


    backToMain() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Main'})],
        });
        this.props.navigation.dispatch(resetAction);
    }

    onCheckbox1Change(recipient, index) {
        this.setState({
            checkBox1: !this.state.checkBox1
        })
    }

    onCheckbox2Change(recipient, index) {
        this.setState({
            checkBox2: !this.state.checkBox2
        })
    }

    provideContacts() {
        let tempArray = [];
        if (this.state.checkBox1) {
            tempArray.push(recipientArray[0])
        }

        if (this.state.checkBox2) {
            tempArray.push(recipientArray[1])
        }
        this.props.navigation.navigate('Main', {
            contacts: tempArray
        });
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
                <ScrollView style={styles.container}>
                    <View style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        backgroundColor: colors.lightGray,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start'
                    }}
                    >

                        <View
                            style={{
                                alignSelf: 'stretch',
                                backgroundColor: colors.lightGray,
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start'
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    backgroundColor: colors.lightGray,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start'
                                }}>
                                <Text style={styles.title}>Name</Text>
                                <Text style={styles.recipient_name}>{recipientArray[0].name}</Text>
                                <Text style={styles.title}>Email: </Text>
                                <Text style={styles.recipient_name}>{recipientArray[0].email}</Text>
                                <View
                                    style={{
                                        alignSelf: 'stretch',
                                        height: 1,
                                        backgroundColor: 'black'
                                    }}/>
                            </View>
                            <CheckBox
                                style={{
                                    height: 28,
                                    width: 28,
                                    margin: 8
                                }}
                                onValueChange={(e) => this.onCheckbox1Change(e)}
                                value={this.state.checkBox1}
                            />
                        </View>

                        <View
                            style={{
                                alignSelf: 'stretch',
                                backgroundColor: colors.lightGray,
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start'
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    backgroundColor: colors.lightGray,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start'
                                }}>
                                <Text style={styles.title}>Name</Text>
                                <Text style={styles.recipient_name}>{recipientArray[1].name}</Text>
                                <Text style={styles.title}>Email: </Text>
                                <Text style={styles.recipient_name}>{recipientArray[1].email}</Text>
                                <View
                                    style={{
                                        alignSelf: 'stretch',
                                        height: 1,
                                        backgroundColor: 'black'
                                    }}/>
                            </View>
                            <CheckBox
                                style={{
                                    height: 28,
                                    width: 28,
                                    margin: 8
                                }}
                                onValueChange={(e) => this.onCheckbox2Change(e)}
                                value={this.state.checkBox2}
                            />
                        </View>


                        <View
                            style={{
                                alignSelf: 'stretch',
                                backgroundColor: colors.lightGray,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 8
                            }}>
                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={(e) => this.props.navigation.navigate('Main', {
                                    contacts: []
                                })}>
                                <Image
                                    source={require('../assets/close-circle.png')}
                                    style={{width: 48, height: 48, margin: 16}}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={(e) => this.provideContacts()}>
                                <Image
                                    source={require('../assets/checkbox-marked-circle.png')}
                                    style={{width: 48, height: 48, margin: 16}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch'
    },
    title: {
        color: colors.textBlack,
        fontSize: 16,
        fontWeight: 'bold',
        margin: 8
    },
    recipient_name: {
        color: colors.textBlack,
        fontSize: 16,
        margin: 8
    },
});


