import {
    View,
    StyleSheet
} from 'react-native';

import React, {Component} from 'react';

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

