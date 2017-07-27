import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Container, Content, Text, Body, Card, CardItem, Left, Right, Button } from 'native-base';
import { RequestBadge } from '../components/RequestBadge';
import { ExpandableText } from '../components/ExpandableText';
import { withNavigation } from '@expo/ex-navigation';

import Colors from '../constants/Colors';

@withNavigation
export default class LinksScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Links',
    },
  };

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

  _renderRow = (entry, i) => (
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
          <Text style={{ color: Colors.tabIconSelected }}>Copy Request</Text>
        </Right>
      </CardItem>
    </Card>
  );

  render() {
    // TODO: generate UID for each object

    return (
      <ListView
        style={{ marginHorizontal: 5 }}
        contentContainerStyle={this.props.route.getContentContainerStyle()}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
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
