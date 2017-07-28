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

    const history = [
      {
        url: 'api.com/v1/users',
        type: 'GET',
      },
      {
        url: 'api.com/v2/users',
        type: 'POST',
      },
      {
        url: 'api.com/v1/locations/2',
        type: 'DELETE',
      },
      {
        url: 'api.com/v2/users/bob',
        type: 'PUT',
      },
      {
        url: 'google.com/search',
        type: 'GET',
      },
      {
        url: 'google.com/imag12nj3j213jn3122112212121jn2j3n1es',
        type: 'POST',
      },
    ];

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(history),
    };
  }

  _copyRequest(navigate, request) {
    navigate('Home', {
      requestUrl: request.url,
      requestType: request.type.toLowerCase(),
    });
  }

  render() {
    // TODO: generate UID for each object
    const { navigate } = this.props.navigation;

    return (
      <ListView
        style={{ marginHorizontal: 5 }}
        dataSource={this.state.dataSource}
        renderRow={(entry, i) => (
          <Card key={i}>
            <CardItem header>
              <ExpandableText style={{ fontWeight: 'bold', maxWidth: '75%' }} text={entry.url} />
              <Right>
                <RequestBadge type={entry.type} />
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
