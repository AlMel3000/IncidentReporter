/** @format */

import {AppRegistry} from 'react-native';

import AppContainer from './app/container/AppNavContainer';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppContainer);
