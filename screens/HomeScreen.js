import React from 'react';

import axios from 'axios';

import Expo from 'expo';

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
  Keyboard,
  StatusBar,
} from 'react-native';

import {
  Item,
  Input,
  Label,
  Picker,
  Content,
  Button,
  Toast,
  List,
  ListItem,
  Left,
  Right,
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import { Col, Row, Grid } from 'react-native-easy-grid';

import validator from 'validator';

import normalize from 'normalize-url';

import { ExpandableText } from '../components/ExpandableText';

import styles from '../styles/homeScreen/style';

import Colors from '../constants/Colors';

export default class HomeScreen extends React.Component {
  static navigationOptions({ navigation }) {
    return {
      title: 'Home',
      tabBarLabel: 'Home',
      headerStyle: {
        height: Platform.OS === 'ios' ? 64 : (56 + StatusBar.currentHeight),
        paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
      },
      tabBarIcon: ({ tintColor }) => (
        <MaterialIcons
          name="home"
          size={25}
          color={tintColor}
        />
      ),
    };
  }

  constructor(props) {
    super(props);
  }

  state = {
    type: 'get',
    url: null,
    res: 'test',
    valid: false,
    showResponseBody: true,
    responseHeaders: {},
  };

  // Update state of request screen when user attempts to copy request from history screen
  componentWillReceiveProps(nextProps) {
    const { navigation: { state: { params } } } = nextProps;
    this.setState({ url: params.requestUrl });
    this.setState({ type: params.requestType });
  }

  updateUrl(input) {
    const urlIsValid = validator.isURL(input);
    this.setState({ valid: urlIsValid });

    // Only normalize url if input is valid
    const normalizedUrl = urlIsValid ? normalize(input) : input;
    this.setState({ url: normalizedUrl });
  }

  updatePick(value) {
    this.setState({ type: value });
    console.log(`Update request type: ${this.state.type}`);
  }

  _renderResponseBody() {
    return this.state.showResponseBody ? <Text>{this.state.res}</Text> : null;
  }

  _renderResponseHeaders() {
    if (!this.state.showResponseBody) {
      return (<List>
        {Object.keys(this.state.responseHeaders).map((headerKey) => (
          <ListItem key={headerKey}>
            <Left><ExpandableText text={headerKey} /></Left>
            <Right><ExpandableText text={this.state.responseHeaders[headerKey]} /></Right>
          </ListItem>
        ))}
      </List>);
    }
    return null;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
              value={this.state.url}
              placeholder='Enter request URL'
              onChangeText={(text) => this.updateUrl(text)}
            />
          </Item>
          <Button
            style={{ flex: 0.1, backgroundColor: Colors.mainTheme }} rounded
            onPress={this._handleHelpPress}
          >
            <Text style={{ textAlign: 'center', paddingLeft: 5 }}>Send</Text>
          </Button>
        </View>
        <Grid style={styles.responseGrid}>
          <Row style={styles.responseTab}>
            <Col size={20} style={styles.viewCol}>
              <TouchableOpacity onPress={() => this._handleSwitchResponseView('body')}>
                <Text style={this._handleSelectedStyle('body')}>Body</Text>
              </TouchableOpacity>
            </Col>
            <Col size={20} style={styles.viewCol}>
              <TouchableOpacity onPress={() => this._handleSwitchResponseView('headers')}>
                <Text style={this._handleSelectedStyle('headers')}>Headers</Text>
              </TouchableOpacity>
            </Col>
            <Col size={15}><TouchableOpacity /></Col>
            <Col size={20}><Text style={styles.responseStat}>Status: {this.state.status}</Text></Col>
            <Col size={25}><Text style={styles.responseStat}>Time: {this.state.time}</Text></Col>
          </Row>
          <Row style={{ flex: 1.0 }}>
            <ScrollView style={styles.responseContainer}>
              {this._renderResponseBody()}
              {this._renderResponseHeaders()}
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

  _handleSelectedStyle = (name) => {
    if (this.state.showResponseBody && name === 'body') {
      return styles.viewTabSelected;
    } else if (!this.state.showResponseBody && name === 'headers') {
      return styles.viewTabSelected;
    }
    return styles.viewTab;
  }

  _handleSwitchResponseView = (name) => {
    if (name === 'body') {
      this.setState({ showResponseBody: true });
    } else {
      this.setState({ showResponseBody: false });
    }
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
    Keyboard.dismiss();
    console.log(`Update url: ${this.state.url}`);
    const requestTime = (new Date()).getTime();
    if (this.state.valid) {
      await axios({
        method: this.state.type,
        url: this.state.url,
      }).then((response) => {
        const responseStatus = response ? response.status : '';
        this._handleResponseTime(requestTime);
        this.setState({ res: JSON.stringify(response.data, null, '\t') });
        this.setState({ status: responseStatus });
        this.setState({ responseHeaders: response.headers });
      }).catch((error) => {
        this._handleResponseTime(requestTime);
        const responseStatus = error.response ? error.response.status : '';
        this.setState({ res: '' });
        this.setState({ responseHeaders: {} });
        this.setState({ status: responseStatus });
        Toast.show({
          text: `${error}`,
          position: 'bottom',
          buttonText: 'Dismiss',
          duration: 3000,
        });
      });
    } else {
      Toast.show({
        text: 'Error: Invalid URL',
        position: 'bottom',
        buttonText: 'Dismiss',
        duration: 3000,
      });
    }
  };
}
