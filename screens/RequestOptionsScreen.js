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
      fabActive: 'true',
      bodyType: 'form-data',
    };
  }

  deleteRow(tab, secId, rowId, rowMap) {
    // Delete row where slide button was pressed
    rowMap[`${secId}${rowId}`].props.closeRow();
    if (tab === 'Parameters') {
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

  addRow(tab) {
    // Add a row to request parameters or headers, depending on which is currently being shown
    if (tab === 'Parameters') {
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
              <ScrollView style={{ flex: 0.8 }}>
                <List
                  dataSource={this.ds.cloneWithRows(this.props.screenProps.requestParameters)}
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
                              onChangeText={(text) => this._handleUpdateList('Parameters', text, secId, rowId, rowMap, 0)}
                            />
                          </Col>
                          <Col size={50}>
                            <Input
                              type='text'
                              placeholder='Value'
                              style={{ textAlign: 'center' }}
                              value={data[1]}
                              onChangeText={(text) => this._handleUpdateList('Parameters', text, secId, rowId, rowMap, 1)}
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
                    (<Button full danger style={{ height: '100%' }} onPress={() => this.deleteRow('Parameters', secId, rowId, rowMap)}>
                      <Icon active name="trash" />
                    </Button>)}
                  leftOpenValue={0}
                  rightOpenValue={-75}
                />
                <Button
                  onPress={() => this.addRow('Parameters')}
                  style={{ backgroundColor: 'white', height: 50, width: '100%', justifyContent: 'center', borderColor: '#bcccd1', borderWidth: 0.5 }}
                >
                  <Text>New</Text>
                </Button>
              </ScrollView>
            </Tab>
            <Tab
              heading="Headers"
              tabStyle={{ ...this.props.screenProps.theme.tabBar }}
              textStyle={{ ...this.props.screenProps.theme.text }}
              activeTabStyle={{ ...this.props.screenProps.theme.tabBar }}
              activeTextStyle={{ color: Colors.mainTheme }}
            >
              <ScrollView style={{ flex: 0.8 }}>
                <List
                  dataSource={this.ds.cloneWithRows(this.props.screenProps.requestHeaders)}
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
                              onChangeText={(text) => this._handleUpdateList('Headers', text, secId, rowId, rowMap, 0)}
                            />
                          </Col>
                          <Col size={50}>
                            <Input
                              type='text'
                              placeholder='Value'
                              style={{ textAlign: 'center' }}
                              value={data[1]}
                              onChangeText={(text) => this._handleUpdateList('Headers', text, secId, rowId, rowMap, 1)}
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
                    (<Button full danger style={{ height: '100%' }} onPress={() => this.deleteRow('Headers', secId, rowId, rowMap)}>
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
            </Tab>
            <Tab
              heading="Body"
              tabStyle={{ ...this.props.screenProps.theme.tabBar }}
              textStyle={{ ...this.props.screenProps.theme.text }}
              activeTabStyle={{ ...this.props.screenProps.theme.tabBar }}
              activeTextStyle={{ color: Colors.mainTheme }}
            >
              <Fab
                active={this.state.active}
                direction="up"
                containerStyle={{ marginLeft: 10 }}
                style={{ backgroundColor: Colors.mainTheme }}
                position="bottomRight"
                onPress={() => this.setState({ active: !this.state.active })}
              >
                <Icon name="list" />
                <Button
                  style={{ backgroundColor: '#34A34F' }}
                  onPress={() => this.setState({ bodyType: 'form-data' })}
                >
                  <Text style={{ textAlign: 'center', color: 'white' }}>form-data</Text>
                </Button>
                <Button
                  style={{ backgroundColor: '#3B5998' }}
                  onPress={() => this.setState({ bodyType: 'x-www-form-urlencoded' })}
                >
                  <Text style={{ textAlign: 'center', color: 'white' }}>x-www-form-urlencoded</Text>
                </Button>
                <Button
                  style={{ backgroundColor: '#DD5144' }}
                  onPress={() => this.setState({ bodyType: 'raw' })}
                >
                  <Text style={{ textAlign: 'center', color: 'white' }}>raw</Text>
                </Button>
              </Fab>
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
    if (tab === 'Parameters') {
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
  _handleBody() {
    if (this.state.bodyType === 'form-data') {
      return (<Text>form-data</Text>);
    } else if (this.state.bodyType === 'x-www-form-urlencoded') {
      return (<Text>x-www-form-urlencoded</Text>);
    }
    return (<Text>raw</Text>);
  }
}

