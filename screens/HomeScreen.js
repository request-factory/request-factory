import React from 'react';

import axios from 'axios';

import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
} from 'react-native';

import {
  Item,
  Input,
  Label,
  Picker,
  Content,
  Button,
  Toast,
} from 'native-base';

import { MonoText } from '../components/StyledText';

import styles from '../styles/homeScreen/style';

export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Home',
    },
  };

  constructor(props) {
    super(props);
  }

  state = {
    type: 'get',
    url: null,
    res: 'test',
  };

  updateUrl(input) {
    this.setState({ url: input });
    console.log(`Update url: ${this.state.url}`);
  }

  updatePick(value) {
    this.setState({ type: value });
    console.log(`Update request type: ${this.state.type}`);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Picker
            style={{ flex: 0.2 }}
            selectedValue={this.state.type}
            onValueChange={(value) => this.updatePick(value)}
          >
            <Picker.Item label="GET" value="get" />
            <Picker.Item label="PUT" value="put" />
            <Picker.Item label="POST" value="post" />
            <Picker.Item label="PATCH" value="patch" />
            <Picker.Item label="DELETE" value="delete" />
            <Picker.Item label="COPY" value="copy" />
            <Picker.Item label="HEAD" value="head" />
            <Picker.Item label="OPTIONS" value="options" />
            <Picker.Item label="LINK" value="link" />
            <Picker.Item label="UNLINK" value="unlink" />
            <Picker.Item label="PURGE" value="purge" />
            <Picker.Item label="LOCK" value="lock" />
            <Picker.Item label="UNLOCK" value="unlock" />
            <Picker.Item label="PROPFIND" value="propfind" />
            <Picker.Item label="VIEW" value="view" />
          </Picker>
          <Item rounded style={{ flex: 0.4, height: 50 }}>
            <Input
              placeholder='Enter request URL'
              onChangeText={(text) => this.updateUrl(text)}
            />
          </Item>
          <Button
            style={{ flex: 0.1 }} rounded info
            onPress={this._handleHelpPress}
          >
            <Text style={{ textAlign: 'center', paddingLeft: 5 }}>Send</Text>
          </Button>
        </View>
        <ScrollView style={styles.responseContainer}>
          <Text>{this.state.res}</Text>
        </ScrollView>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will run slightly slower but
          you have access to useful development tools. {learnMoreButton}.
        </Text>
      );
    }
    return (
      <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
      </Text>
    );
  }

  _handleLearnMorePress = () => {
    Linking.openURL(
      'https://docs.expo.io/versions/latest/guides/development-mode'
    );
  };

  _handleHelpPress = async () => {
    await axios({
      method: this.state.type,
      url: this.state.url,
    }).then((response) => {
      this.setState({ res: JSON.stringify(response.data, null, '\t') });
      console.log(this.state.res);
    }).catch((error) => {
      Toast.show({
        text: `${error}`,
        position: 'bottom',
        buttonText: 'Dismiss',
        duration: 3000,
      });
    });
  };
}
