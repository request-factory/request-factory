import React from 'react';

import axios from 'axios';

import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
  StatusBar,
  Modal,
  TouchableHighlight,
  ListView,
} from 'react-native';

import {
  Item,
  Input,
  Content,
  Button,
  Toast,
  List,
  ListItem,
  Left,
  Right,
  Container,
  Card,
  CardItem,
  Icon,
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import { Col, Row, Grid } from 'react-native-easy-grid';

import validator from 'validator';

import normalize from 'normalize-url';

import { ExpandableText } from '../components/ExpandableText';

import styles from '../styles/homeScreen/style';

import { RequestPicker } from '../components/RequestPicker';

import Colors from '../constants/Colors';

export default class HomeScreen extends React.Component {
  static navigationOptions({ navigation }) {
    return {
      title: '',
      tabBarLabel: 'Home',
      header: null,
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
    this.state = {
      type: 'get',
      url: null,
      res: '',
      valid: false,
      showResponseBody: true,
      responseHeaders: {},
    };
  }

  // Update state of request screen when user attempts to copy request from history screen
  componentWillReceiveProps(nextProps) {
    const { navigation: { state: { params } } } = nextProps;
    if (params !== undefined) {
      this.setState({ url: params.requestUrl });
      this.setState({ type: params.requestType });
    }
  }

  saveParameters() {
    // Remove items with no key from request parameters
    // TODO: Display warning message when user has empty parameters
    const newData = [...this.props.screenProps.requestParameters];
    for (let i = 0; i < newData.length; i++) {
      if (newData[i][0] === '') {
        newData.splice(i, 1);
        i--;
      }
    }
    this.props.screenProps.requestParameters = newData;
  }

  saveHeaders() {
    // Remove items with no key from request headers
    // TODO: Display warning message when user has empty headers
    const newData = [...this.props.screenProps.requestHeaders];
    for (let i = 0; i < newData.length; i++) {
      if (newData[i][0] === '') {
        newData.splice(i, 1);
        i--;
      }
    }
    this.props.screenProps.requestHeaders = newData;
  }

  convertList(list) {
    // Converts a list of parameters or readers in native base list format [['key', 'value'], ['key', 'value']]
    // to be used in a request {'key: 'value', 'key', 'value'}
    this.newList = {};
    for (let i = 0; i < list.length; i++) {
      if (!(list[i][0] in this.newList)) {
        this.newList[list[i][0]] = list[i][1];
      }
    }
    return this.newList;
  }

  updateUrl(input) {
    const urlIsValid = validator.isURL(input);
    this.setState({ valid: urlIsValid });

    // Only normalize url if input is valid
    const normalizedUrl = urlIsValid ? normalize(input) : input;
    this.setState({ url: normalizedUrl });
  }

  updatePick = (value) => {
    this.setState({ type: value });
    console.log(`Update request type: ${this.state.type}`);
  }

  _renderResponseBody() {
    return this.state.showResponseBody ? <Text style={this.props.screenProps.theme.text}>{this.state.res}</Text> : null;
  }

  _renderResponseHeaders() {
    if (!this.state.showResponseBody) {
      return (<List>
        {Object.keys(this.state.responseHeaders).map((headerKey) => (
          <ListItem key={headerKey}>
            <Left><ExpandableText text={headerKey} style={this.props.screenProps.theme.text} /></Left>
            <Right><ExpandableText text={this.state.responseHeaders[headerKey]} style={this.props.screenProps.theme.text} /></Right>
          </ListItem>
        ))}
      </List>);
    }
    return null;
  }

  _openParametersScreen(navigate) {
    navigate('RequestOptions');
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, ...this.props.screenProps.theme.requestContainer }}>
        <View style={[styles.container, this.props.screenProps.theme.requestContainer]}>
          <Container style={StyleSheet.flatten(styles.pickerContainer)}>
            <Content>
              <RequestPicker updatePick={this.updatePick} type={this.state.type} />
            </Content>
          </Container>
          <View style={[styles.urlBox, this.props.screenProps.theme.urlBox]}>
            <Input
              style={StyleSheet.flatten([styles.url, this.props.screenProps.theme.text])}
              value={this.state.url}
              placeholder='Enter request URL'
              onChangeText={(text) => this.updateUrl(text)}
              returnKeyType='send'
              onSubmitEditing={this._handleHelpPress}
            />
          </View>
          <Button
            transparent
            style={StyleSheet.flatten([styles.requestHeader, this.props.screenProps.theme.urlBox])}
            onPress={() => this._openParametersScreen(navigate)}
          >
            <MaterialIcons
              name="menu"
              size={25}
              color={'#bcccd1'}
            />
          </Button>
          {/* <Button
            style={StyleSheet.flatten(styles.sendButton)}
            onPress={this._handleHelpPress}
          >
            <MaterialIcons
              name="search"
              size={25}
              color={'white'}
            />
          </Button> */}
        </View>
        <Grid style={styles.responseGrid}>
          <Row style={[styles.responseTab, this.props.screenProps.theme.requestTab]}>
            <Col size={15} style={[this.props.screenProps.theme.requestContainer, styles.responseCol]}>
              <TouchableOpacity onPress={() => this._handleSwitchResponseView('body')}>
                <Text style={this._handleSelectedStyle('body')}>Body</Text>
              </TouchableOpacity>
            </Col>
            <Col size={20} style={[this.props.screenProps.theme.requestContainer, styles.responseCol]}>
              <TouchableOpacity onPress={() => this._handleSwitchResponseView('headers')}>
                <Text style={this._handleSelectedStyle('headers')}>Headers</Text>
              </TouchableOpacity>
            </Col>
            <Col style={this.props.screenProps.theme.requestContainer} size={10} />
            <Col style={[this.props.screenProps.theme.requestContainer, styles.responseCol]} size={25}>
              <Text style={[styles.responseStat, this.props.screenProps.theme.responseStat]}>Status: {this.state.status}</Text>
            </Col>
            <Col style={[this.props.screenProps.theme.requestContainer, styles.responseCol]} size={30}>
              <Text style={[styles.responseStat, this.props.screenProps.theme.responseStat]}>Time: {this.state.time}</Text>
            </Col>
          </Row>
          <Row style={{ flex: 1.0 }}>
            <ScrollView style={this.props.screenProps.theme.responseContainer}>
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
    // Changes the colour of the currently selected tab in the request screen
    if (this.state.showResponseBody && name === 'body') {
      return [styles.viewTab, styles.viewTabSelected];
    } else if (!this.state.showResponseBody && name === 'headers') {
      return [styles.viewTab, styles.viewTabSelected];
    }
    return [styles.viewTab, this.props.screenProps.theme.text];
  }

  _handleSwitchResponseView = (name) => {
    // Switches view when tab is changed in main/response modal
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
    let body = [];

    if (this.props.screenProps.requestBodyType === 'form-data') {
      body = this.props.screenProps.bodyForm;
    } else if (this.props.screenProps.requestBodyType === 'x-www-form-urlencoded') {
      body = this.props.screenProps.bodyUrlEncoded;
    } else {
      console.log('raw');
    }
    //console.log(body);
    console.log(this.props.screenProps.requestHeaders);
    Keyboard.dismiss();
    const requestTime = (new Date()).getTime();
    this.saveParameters();
    this.saveHeaders();
    const requestObj = {
      method: this.state.type,
      url: this.state.url,
      headers: this.convertList(this.props.screenProps.requestHeaders),
      params: this.convertList(this.props.screenProps.requestParameters),

      // data: this.convertList(this.props.)
    };

    if (this.state.valid) {
      await axios(requestObj).then((response) => {
        const responseStatus = response ? response.status : '';
        this._handleResponseTime(requestTime);
        this.setState({ res: JSON.stringify(response.data, null, '\t') });
        this.setState({ status: responseStatus });
        this.setState({ responseHeaders: response.headers });
        this.props.screenProps.updateHistory({ ...requestObj, _id: requestTime });
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
