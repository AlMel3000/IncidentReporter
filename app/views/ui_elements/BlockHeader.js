import React, {Component} from 'react';

import {Text, View} from 'react-native';

import colors from '../data/colors'


export default class BlockHeader extends Component {


    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {

        return (

            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    alignSelf: 'stretch',
                    margin: 8,
                    backgroundColor: colors.lightGray
                }}>

                <Text
                    style={{
                        color: colors.textBlack,
                        fontSize: 18
                    }}>
                    {this.props.blockHeaderText}
                </Text>

                <View
                    style={{
                        alignSelf: 'stretch',
                        height: 1,
                        backgroundColor: 'black'
                    }}/>
            </View>
        );
    }
}