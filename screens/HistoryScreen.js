import React from 'react';
import { ListView, StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Text, Body, Card, CardItem, Right } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { RequestBadge } from '../components/RequestBadge';
import { ExpandableText } from '../components/ExpandableText';
import Colors from '../constants/Colors';

export default class HistoryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'History',
    tabBarLabel: 'History',
    headerStyle: {
      height: Platform.OS === 'ios' ? 64 : (56 + StatusBar.currentHeight),
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons
        name="history"
        size={25}
        color={tintColor}
      />
    ),
  })

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }

  // Update state of history screen when user makes a new request
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.screenProps.history),
    });
  }

  _copyRequest(navigate, request) {
    navigate('Home', {
      requestUrl: request.url,
      requestType: request.method.toLowerCase(),
    });
  }

  render() {
    // TODO: generate UID for each object
    const { navigate } = this.props.navigation;

    return (
      <ListView
        style={{ marginHorizontal: 5 }}
        enableEmptySections
        dataSource={this.state.dataSource}
        renderRow={(entry) => (
          <Card key={entry._id}>
            <CardItem header>
              <ExpandableText style={{ fontWeight: 'bold', maxWidth: '75%' }} text={entry.url} />
              <Right>
                <RequestBadge type={entry.method.toUpperCase()} />
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                      Body
                </Text>
              </Body>
            </CardItem>
            <View
              style={{
                borderBottomColor: '#d6d7da',
                borderBottomWidth: 0.6,
              }}
            />
            <CardItem footer>
              <Text>Footer</Text>
              <Right>
                <Text style={{ color: Colors.mainTheme }} onPress={() => this._copyRequest(navigate, entry)}>Copy Request</Text>
              </Right>
            </CardItem>
          </Card>
        )}
        onEndReached={this._onEndReached}
        initialListSize={5}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
});
