import Expo from 'expo';
import React from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Root } from 'native-base';

import Navigator from './navigation/RootNavigation';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

const HISTORY_KEY = 'request_history';

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    requestHistory: [],
  };

  componentWillMount() {
    this._loadAssetsAsync();
    AsyncStorage.getItem(HISTORY_KEY).then((value) => {
      if (value != null) {
        this.setState({ requestHistory: JSON.parse(value) });
      }
    }).then(this.setState({ appIsReady: true }));
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          {
            'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
            'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
          },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    }
  }

  _updateLocalStorage = () => {
    AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(this.state.requestHistory));
  }

  updateRequestHistory = (request) => {
    this.setState({ requestHistory: [request, ...this.state.requestHistory] },
      this._updateLocalStorage
    );
  }

  _clearRequestHistory = () => {
    this.setState({ requestHistory: [] },
      this._updateLocalStorage
    );
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <Root>
          <View style={styles.container}>
            <Navigator screenProps={{
              updateHistory: this.updateRequestHistory,
              history: this.state.requestHistory,
              clearRequestHistory: this._clearRequestHistory }}
            />
          </View>
        </Root>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

Expo.registerRootComponent(AppContainer);
