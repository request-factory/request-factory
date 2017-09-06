import React from 'react';
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  ListView,
} from 'react-native';

import {
  Input,
  Button,
  List,
  ListItem,
  Icon,
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import styles from '../styles/homeScreen/style';

import Colors from '../constants/Colors';

export default class ParametersScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Request Options',
    headerStyle: {
      height: Platform.OS === 'ios' ? 64 : (56 + StatusBar.currentHeight),
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
      ...screenProps.theme.header,
    },
    headerTintColor: screenProps.theme.text.color,
  })

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id });
    this.state = {
      showParameters: true,
    };
  }

  deleteRow(secId, rowId, rowMap) {
    // Delete row where slide button was pressed
    rowMap[`${secId}${rowId}`].props.closeRow();
    if (this.state.showParameters) {
      const newData = [...this.props.screenProps.requestParameters];
      newData.splice(rowId, 1);
      this.props.screenProps.requestParameters = newData;
    } else {
      const newData = [...this.props.screenProps.requestHeaders];
      newData.splice(rowId, 1);
      this.props.screenProps.requestHeaders = newData;
    }
    this.forceUpdate();
  }

  addRow() {
    // Add a row to request parameters or headers, depending on which is currently being shown
    if (this.state.showParameters) {
      const newData = [...this.props.screenProps.requestParameters];
      newData.push(['', '']);
      this.props.screenProps.requestParameters = newData;
    } else {
      const newData = [...this.props.screenProps.requestHeaders];
      newData.push(['', '']);
      this.props.screenProps.requestHeaders = newData;
    }
    this.forceUpdate();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={[this.props.screenProps.theme.requestContainer,
          { position: 'absolute', flexDirection: 'column', height: '100%', width: '100%' }]}
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
        </View>
      </View>
    );
  }
  _handleUpdateList(text, secId, rowId, rowMap, index) {
    // Updates list based on user input
    rowMap[`${secId}${rowId}`].props.closeRow();
    if (this.state.showParameters) {
      const newData = [...this.props.screenProps.requestParameters];
      newData[rowId][index] = text;
      this.props.screenProps.requestParameters = newData;
    } else {
      const newData = [...this.props.screenProps.requestHeaders];
      newData[rowId][index] = text;
      this.props.screenProps.requestHeaders = newData;
    }
    this.forceUpdate();
  }

  _handleParameters() {
    if (this.state.showParameters) {
      return this.props.screenProps.requestParameters;
    }
    return this.props.screenProps.requestHeaders;
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
}

