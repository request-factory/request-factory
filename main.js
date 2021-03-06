import Expo from 'expo';
import React from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Root } from 'native-base';

import Navigator from './navigation/RootNavigation';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import themes from './constants/Themes';

const HISTORY_KEY = 'request_history';
const NIGHT_MODE_KEY = 'night_mode';

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    requestHistory: [],
    theme: themes.lightTheme,
    requestBodyType: 'form-data',
    requestParametersData: [],
    requestHeadersData: [],
    bodyFormData: [],
    bodyUrlEncodedData: [],
    bodyRawData: "",
  };

  componentWillMount() {
    this._loadAssetsAsync();
    AsyncStorage.multiGet([HISTORY_KEY, NIGHT_MODE_KEY]).then((data) => {
      if (data != null) {
        this.setState({ requestHistory: JSON.parse(data[0][1]) });
      }
      // AsyncStorage stores data as strings, we are using this expression to convert data back to a boolean
      const isNightModeToggled = data[1][1] != null ? (data[1][1] == 'true') : false;
      this.setState({ nightModeToggled: isNightModeToggled });
      this._toggleNightMode(isNightModeToggled);
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

  _loadRequestOptions = (request) => {
    this.setState({ requestParametersData: request.parameters,
      requestHeadersData: request.headers,
      bodyFormData: request.bodyForm,
      bodyUrlEncodedData: request.bodyUrlEncoded,
      bodyRawData: request.bodyRaw });
  }

  _changeBodyType = (type) => {
    this.setState({ requestBodyType: type });
  }

  _updateList = (tab, newData) => {
    if (tab === 'Parameters') {
      this.setState({ requestParametersData: newData });
    } else if (tab === 'Headers') {
      this.setState({ requestHeadersData: newData });
    } else if (tab === 'form-data') {
      this.setState({ bodyFormData: newData });
    } else if (tab === 'x-www-form-urlencoded') {
      this.setState({ bodyUrlEncodedData: newData });
    } else {
      this.setState({ bodyRawData: newData });
    }
  }

  _toggleNightMode = (value) => {
    if (value) {
      this.setState({ theme: themes.darkTheme });
    } else {
      this.setState({ theme: themes.lightTheme });
    }
    this.setState({ nightModeToggled: value });
    AsyncStorage.setItem(NIGHT_MODE_KEY, value.toString());
  }

  render() {
    // Render Navigator when night mode state has been set and app data has been
    // been fetched from local storage.
    if (this.state.nightModeToggled != null && this.state.appIsReady) {
      return (
        <Root>
          <View style={styles.container}>
            <Navigator screenProps={{
              updateHistory: this.updateRequestHistory,
              history: this.state.requestHistory,
              clearRequestHistory: this._clearRequestHistory,
              toggleNightMode: this._toggleNightMode,
              theme: this.state.theme,
              isNightModeToggled: this.state.nightModeToggled,
              updateList: this._updateList,
              loadRequestOptions: this._loadRequestOptions,
              requestBodyType: this.state.requestBodyType,
              changeBodyType: this._changeBodyType,
              requestParameters: this.state.requestParametersData,
              requestHeaders: this.state.requestHeadersData,
              bodyForm: this.state.bodyFormData,
              bodyUrlEncoded: this.state.bodyUrlEncodedData,
              bodyRaw: this.state.bodyRawData }}
            />
          </View>
        </Root>
      );
    }
    return <Expo.AppLoading />;
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
