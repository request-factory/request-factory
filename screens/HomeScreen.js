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
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import { Col, Row, Grid } from 'react-native-easy-grid';

import validator from 'validator';

import normalize from 'normalize-url';

import { ExpandableText } from '../components/ExpandableText';

import styles from '../styles/homeScreen/style';

import { RequestPicker } from '../components/RequestPicker';

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
  }

  state = {
    type: 'get',
    url: null,
    res: '',
    valid: false,
    showResponseBody: true,
    responseHeaders: {},
  };

  // Update state of request screen when user attempts to copy request from history screen
  componentWillReceiveProps(nextProps) {
    const { navigation: { state: { params } } } = nextProps;
    if (params !== undefined) {
      this.setState({ url: params.requestUrl });
      this.setState({ type: params.requestType });
    }
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
      <View style={{ flex: 1, backgroundColor: '#f7f7f7', paddingTop: StatusBar.currentHeight }}>
        <View style={styles.container}>
          <Container style={StyleSheet.flatten(styles.pickerContainer)}>
            <Content>
              <RequestPicker updatePick={this.updatePick} type={this.state.type} />
            </Content>
          </Container>
          <Item style={StyleSheet.flatten(styles.urlBox)}>
            <Input
              style={StyleSheet.flatten(styles.url)}
              value={this.state.url}
              placeholder='Enter request URL'
              onChangeText={(text) => this.updateUrl(text)}
              returnKeyType='send'
              onSubmitEditing={this._handleHelpPress}
            />
          </Item>
          <Button
            transparent
            style={StyleSheet.flatten(styles.requestHeader)}
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
          <Row style={styles.responseTab}>
            <Col size={15} style={styles.viewCol}>
              <TouchableOpacity onPress={() => this._handleSwitchResponseView('body')}>
                <Text style={this._handleSelectedStyle('body')}>Body</Text>
              </TouchableOpacity>
            </Col>
            <Col size={20} style={styles.viewCol}>
              <TouchableOpacity onPress={() => this._handleSwitchResponseView('headers')}>
                <Text style={this._handleSelectedStyle('headers')}>Headers</Text>
              </TouchableOpacity>
            </Col>
            <Col style={styles.viewCol} size={10} />
            <Col style={styles.viewCol} size={25}><Text style={styles.responseStat}>Status: {this.state.status}</Text></Col>
            <Col style={styles.viewCol} size={30}><Text style={styles.responseStat}>Time: {this.state.time}</Text></Col>
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
    const requestTime = (new Date()).getTime();
    const requestObj = {
      method: this.state.type,
      url: this.state.url,
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
