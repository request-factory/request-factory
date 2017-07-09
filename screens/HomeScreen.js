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

import { Col, Row, Grid } from 'react-native-easy-grid';

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
        <Grid style={styles.responseGrid}>
          <Row style={styles.responseTab}>
            <Col size={50}><TouchableOpacity><Text style={styles.viewTab}>Body</Text></TouchableOpacity></Col>
            <Col size={20}><Text style={styles.responseStat}>Status: {this.state.status}</Text></Col>
            <Col size={25}><Text style={styles.responseStat}>Time: {this.state.time}</Text></Col>
          </Row>
          <Row style={{ flex: 1.0 }}>
            <ScrollView style={styles.responseContainer}>
              <Text>{this.state.res}</Text>
            </ScrollView>
          </Row>
        </Grid>
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

  _handleResponseTime = (requestTime) => {
    const responseTime = (new Date()).getTime() - requestTime;
    this.setState({ time: `${responseTime} ms` });
  }

  _handleHelpPress = async () => {
    const requestTime = (new Date()).getTime();
    await axios({
      method: this.state.type,
      url: this.state.url,
    }).then((response) => {
      const responseStatus = response ? response.status : '';
      this._handleResponseTime(requestTime);
      this.setState({ res: JSON.stringify(response.data, null, '\t') });
      this.setState({ status: responseStatus });
    }).catch((error) => {
      this._handleResponseTime(requestTime);
      const responseStatus = error.response ? error.response.status : '';
      this.setState({ res: '' });
      this.setState({ status: responseStatus });
      Toast.show({
        text: `${error}`,
        position: 'bottom',
        buttonText: 'Dismiss',
        duration: 3000,
      });
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginTop: 5,
    marginHorizontal: 5,
  },
  responseGrid: {
    flex: 1.6,
    marginRight: 20,
    marginLeft: 20,
  },
  responseContainer: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  responseTab: {
    flex: 0.1,
    padding: 0,
    margin: 0,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#f7f7f7',
  },
  viewTab: {
    marginTop: 10,
    marginLeft: 10,
    textAlign: 'left',
  },
  responseStat: {
    marginTop: 10,
    textAlign: 'center',
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
