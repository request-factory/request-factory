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
} from 'native-base';

import { MonoText } from '../components/StyledText';

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
          </Picker>
          <Item rounded style={{ flex: 0.4, height: 50 }}>
            <Input
              placeholder='Enter request URL'
              onChangeText={(text) => this.updateUrl(text)}
            />
          </Item>
          <Button style={{ flex: 0.1 }} rounded info
            onPress={this._handleHelpPress}>
            <Text style={{ textAlign: 'center', paddingLeft: 5 }}>Send</Text>
          </Button>
        </View>
        <View style={styles.responseContainer}>
          <Text>{this.state.res}</Text>
        </View>
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
    // console.log(this.state);
    // Linking.openURL(
    //   'https://docs.expo.io/versions/latest/guides/development-mode'
    // );
    await axios({
      method: this.state.type,
      url: this.state.url,
    }).then((response) => {
      this.setState({ res: response.toString() });
      console.log(this.state.res);
    });
    // Linking.openURL(
    //   'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    // );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginTop: 5,
    marginHorizontal: 5,
  },
  responseContainer: {

  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 15,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 80,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 140,
    height: 38,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginRight: 20,
    marginTop: 10,
    marginLeft: 100,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
