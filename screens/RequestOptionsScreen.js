import React from 'react';
import {
  Platform,
  ScrollView,
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
  Tab,
  Tabs,
  Fab,
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import styles from '../styles/homeScreen/style';

import { BodyTypePicker } from '../components/BodyTypePicker';

import Colors from '../constants/Colors';

export default class RequestOptionsScreen extends React.Component {
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
  }

  updatePick = (value) => {
    this.props.screenProps.changeBodyType(value);
  }

  deleteRow(tab, secId, rowId, rowMap) {
    // Delete row where slide button was pressed
    rowMap[`${secId}${rowId}`].props.closeRow();
    let newData = [];
    if (tab === 'Parameters') {
      newData = [...this.props.screenProps.requestParameters];
    } else if (tab === 'Headers') {
      newData = [...this.props.screenProps.requestHeaders];
    } else if (tab === 'form-data') {
      newData = [...this.props.screenProps.bodyForm];
    } else {
      newData = [...this.props.screenProps.bodyUrlEncoded];
    }
    newData.splice(rowId, 1);
    this.props.screenProps.updateList(tab, newData);
    this.forceUpdate();
  }

  addRow(tab) {
    // Add a row to request parameters or headers, depending on which is currently being shown
    let newData = [];
    if (tab === 'Parameters') {
      newData = [...this.props.screenProps.requestParameters];
    } else if (tab === 'Headers') {
      newData = [...this.props.screenProps.requestHeaders];
    } else if (tab === 'form-data') {
      newData = [...this.props.screenProps.bodyForm];
    } else {
      newData = [...this.props.screenProps.bodyUrlEncoded];
    }
    this.props.screenProps.updateList(tab, newData);
    newData.push(['', '']);
    this.forceUpdate();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={[this.props.screenProps.theme.requestContainer,
          { position: 'absolute', flexDirection: 'column', height: '100%', width: '100%' }]}
        >
          <Tabs
            initialPage={0}
            tabBarUnderlineStyle={{ backgroundColor: Colors.mainTheme }}
          >
            <Tab
              heading="Parameters"
              tabStyle={{ ...this.props.screenProps.theme.tabBar }}
              textStyle={{ ...this.props.screenProps.theme.text }}
              activeTabStyle={{ ...this.props.screenProps.theme.tabBar }}
              activeTextStyle={{ color: Colors.mainTheme }}
            >
              {this._handleTab('Parameters', this.props.screenProps.requestParameters)}
            </Tab>
            <Tab
              heading="Headers"
              tabStyle={{ ...this.props.screenProps.theme.tabBar }}
              textStyle={{ ...this.props.screenProps.theme.text }}
              activeTabStyle={{ ...this.props.screenProps.theme.tabBar }}
              activeTextStyle={{ color: Colors.mainTheme }}
            >
              {this._handleTab('Headers', this.props.screenProps.requestHeaders)}
            </Tab>

            <Tab
              heading="Body"
              tabStyle={{ ...this.props.screenProps.theme.tabBar }}
              textStyle={{ ...this.props.screenProps.theme.text }}
              activeTabStyle={{ ...this.props.screenProps.theme.tabBar }}
              activeTextStyle={{ color: Colors.mainTheme }}
            >
              <BodyTypePicker updatePick={this.updatePick} type={this.props.screenProps.requestBodyType} screenProps={this.props.screenProps} />
              { this._handleBody() }
            </Tab>
          </Tabs>
        </View>
      </View>
    );
  }
  _handleUpdateList(tab, text, secId, rowId, rowMap, index) {
    // Updates list based on user input
    rowMap[`${secId}${rowId}`].props.closeRow();
    let newData = [];
    if (tab === 'Parameters') {
      newData = [...this.props.screenProps.requestParameters];
    } else if (tab === 'Headers') {
      newData = [...this.props.screenProps.requestHeaders];
    } else if (tab === 'form-data') {
      newData = [...this.props.screenProps.bodyForm];
    } else {
      newData = [...this.props.screenProps.bodyUrlEncoded];
    }
    newData[rowId][index] = text;
    this.props.screenProps.updateList(tab, newData);
    this.forceUpdate();
  }
  _handleBody() {
    if (this.props.screenProps.requestBodyType === 'form-data') {
      return (this._handleTab('form-data', this.props.screenProps.bodyForm));
    } else if (this.props.screenProps.requestBodyType === 'x-www-form-urlencoded') {
      return (this._handleTab('x-www-form-urlencoded', this.props.screenProps.bodyUrlEncoded));
    }
    return (<Text>raw</Text>);
  }
  _handleTab(tabName, list) {
    return (
      <ScrollView style={{ flex: 0.8, ...this.props.screenProps.theme.requestOptions }}>
        <List
          dataSource={this.ds.cloneWithRows(list)}
          enableEmptySections
          renderRow={(data, secId, rowId, rowMap) =>
            (<ListItem style={{ height: 50, width: '100%', ...this.props.screenProps.theme.requestOptions }}>
              <Grid>
                <Row>
                  <Col size={50} >
                    <Input
                      placeholder='Key'
                      type='text'
                      style={{ textAlign: 'center', ...this.props.screenProps.theme.text }}
                      value={data[0]}
                      onChangeText={(text) => this._handleUpdateList(tabName, text, secId, rowId, rowMap, 0)}
                    />
                  </Col>
                  <Col size={50}>
                    <Input
                      type='text'
                      placeholder='Value'
                      style={{ textAlign: 'center', ...this.props.screenProps.theme.text }}
                      value={data[1]}
                      onChangeText={(text) => this._handleUpdateList(tabName, text, secId, rowId, rowMap, 1)}
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
            (<Button full danger style={{ height: '100%' }} onPress={() => this.deleteRow(tabName, secId, rowId, rowMap)}>
              <Icon active name="trash" />
            </Button>)}
          leftOpenValue={0}
          rightOpenValue={-75}
        />
        <Button
          onPress={() => this.addRow(tabName)}
          style={{ ...this.props.screenProps.theme.requestOptions, height: 50, width: '100%', justifyContent: 'center', borderColor: '#bcccd1', borderWidth: 0.5 }}
        >
          <Text style={{ ...this.props.screenProps.theme.text }} >New</Text>
        </Button>
      </ScrollView>);
  }
}

