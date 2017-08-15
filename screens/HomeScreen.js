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

const requestParametersData = [];
const requestHeadersData = [];

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
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id });
    this.state = {
      type: 'get',
      url: null,
      res: '',
      valid: false,
      showResponseBody: true,
      showParameters: true,
      modalVisible: false,
      responseHeaders: {},
      requestParameters: requestParametersData,
      requestHeaders: requestHeadersData,
    };
  }

  deleteRow(secId, rowId, rowMap) {
    // Delete row where slide button was pressed
    rowMap[`${secId}${rowId}`].props.closeRow();
    if (this.state.showParameters) {
      const newData = [...this.state.requestParameters];
      newData.splice(rowId, 1);
      this.setState({ requestParameters: newData });
    } else {
      const newData = [...this.state.requestHeaders];
      newData.splice(rowId, 1);
      this.setState({ requestHeaders: newData });
    }
  }

  addRow() {
    // Add a row to request parameters or headers, depending on which is currently being shown
    if (this.state.showParameters) {
      const newData = [...this.state.requestParameters];
      newData.push(['', '']);
      this.setState({ requestParameters: newData });
    } else {
      const newData = [...this.state.requestHeaders];
      newData.push(['', '']);
      this.setState({ requestHeaders: newData });
    }
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
    const newData = [...this.state.requestParameters];
    for (let i = 0; i < newData.length; i++) {
      if (newData[i][0] === '') {
        newData.splice(i, 1);
        i--;
      }
    }
    this.setState({ requestParameters: newData });
  }

  saveHeaders() {
    // Remove items with no key from request headers
    // TODO: Display warning message when user has empty headers
    const newData = [...this.state.requestHeaders];
    for (let i = 0; i < newData.length; i++) {
      if (newData[i][0] === '') {
        newData.splice(i, 1);
        i--;
      }
    }
    this.setState({ requestHeaders: newData });
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

  showModal = (value) => {
    // If modal is being hidden, save headers and parameters
    if (!value) {
      this.saveParameters();
      this.saveHeaders();
    }
    this.setState({ modalVisible: value });
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

  render() {
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
            onPress={() => this.showModal(true)}
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
        {/*TODO: Move modal CSS to style.js, add theme compatibility */}
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => { this.showModal(!this.state.modalVisible); }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'grey', opacity: 0.7 }}>
              <TouchableHighlight
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                onPress={() => {
                  this.showModal(!this.state.modalVisible);
                }}
              >
                <Text />
              </TouchableHighlight>
            </View>
            <View style={[this.props.screenProps.theme.requestContainer,
              { position: 'absolute', flexDirection: 'column', height: '90%', width: '90%', margin: '5%' }]}
            >
              <Row style={{ flex: 0.08 }}>
                <Col size={50} style={{ justifyContent: 'center', borderColor: '#bcccd1', borderWidth: 0.5 }}>
                  <TouchableOpacity onPress={() => this._handleSwitchParametersView('parameters')}>
                    <Text style={this._handleParametersStyle('parameters')}>Parameters</Text>
                  </TouchableOpacity>
                </Col>
                <Col size={50} style={{ justifyContent: 'center', borderColor: '#bcccd1', borderWidth: 0.5 }}>
                  <TouchableOpacity onPress={() => this._handleSwitchParametersView('headers')}>
                    <Text style={this._handleParametersStyle('headers')}>Headers</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
              <ScrollView style={{ flex: 0.8 }}>
                <List
                  dataSource={this.ds.cloneWithRows(this._handleParameters())}
                  enableEmptySections
                  renderRow={(data, secId, rowId, rowMap) =>
                    (<ListItem style={{ height: 50, width: '100%' }}>
                      <Grid>
                        <Row>
                          <Col size={50} >
                            <Input
                              placeholder='Key'
                              type='text'
                              style={{ textAlign: 'center' }}
                              value={data[0]}
                              onChangeText={(text) => this._handleUpdateList(text, secId, rowId, rowMap, 0)}
                            />
                          </Col>
                          <Col size={50}>
                            <Input
                              type='text'
                              placeholder='Value'
                              style={{ textAlign: 'center' }}
                              value={data[1]}
                              onChangeText={(text) => this._handleUpdateList(text, secId, rowId, rowMap, 1)}
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </ListItem>)}
                  renderLeftHiddenRow={() =>
                    ((<Button full>
                      <Icon active name="information-circle" />
                    </Button>))}
                  renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                    (<Button full danger style={{ height: '100%' }} onPress={() => this.deleteRow(secId, rowId, rowMap)}>
                      <Icon active name="trash" />
                    </Button>)}
                  leftOpenValue={0}
                  rightOpenValue={-75}
                />
                <Button
                  onPress={() => this.addRow()}
                  style={{ backgroundColor: 'white', height: 50, width: '100%', justifyContent: 'center', borderColor: '#bcccd1', borderWidth: 0.5 }}
                >
                  <Text>New</Text>
                </Button>
              </ScrollView>
              <View
                style={{ flexDirection: 'row', flex: 0.12, justifyContent: 'center' }}
              >
                {/* TODO: Add Cancel button that reverts changes and add some visual feedback to save, cancel and new buttons */}
                <Button
                  onPress={() => {
                    this.showModal(!this.state.modalVisible);
                  }}
                  style={{ backgroundColor: Colors.mainTheme }}
                >
                  <Text style={{ textAlign: 'center' }}>Save</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
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

  _handleUpdateList(text, secId, rowId, rowMap, index) {
    // Updates list based on user input
    rowMap[`${secId}${rowId}`].props.closeRow();
    if (this.state.showParameters) {
      const newData = [...this.state.requestParameters];
      newData[rowId][index] = text;
      this.setState({ requestParameters: newData });
    } else {
      const newData = [...this.state.requestHeaders];
      newData[rowId][index] = text;
      this.setState({ requestHeaders: newData });
    }
  }

  _handleParameters() {
    if (this.state.showParameters) {
      return this.state.requestParameters;
    }
    return this.state.requestHeaders;
  }

  _handleParametersStyle = (name) => {
    // Changes the colour of the currently selected tab in the parameters modal
    if (this.state.showParameters && name === 'parameters') {
      return [styles.viewTab, styles.viewTabSelected];
    } else if (!this.state.showParameters && name === 'headers') {
      return [styles.viewTab, styles.viewTabSelected];
    }
    return [styles.viewTab, this.props.screenProps.theme.text];
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

  _handleSwitchParametersView = (name) => {
    // Switches view when tab is changed in parameters modal
    if (name === 'parameters') {
      this.setState({ showParameters: true });
    } else {
      this.setState({ showParameters: false });
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
    // console.log(this.convertList(this.state.requestHeaders));
    // console.log(this.convertList(this.state.requestParameters));
    const requestObj = {
      method: this.state.type,
      url: this.state.url,
      headers: this.convertList(this.state.requestHeaders),
      parameters: this.convertList(this.state.requestParameters),
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
