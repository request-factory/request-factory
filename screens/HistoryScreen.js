import React from 'react';
import { ListView, StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Text, Body, Card, CardItem, Right } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { RequestBadge } from '../components/RequestBadge';
import { ExpandableText } from '../components/ExpandableText';
import Colors from '../constants/Colors';

export default class HistoryScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'History',
    tabBarLabel: 'History',
    headerStyle: {
      height: Platform.OS === 'ios' ? 64 : (56 + StatusBar.currentHeight),
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
      ...screenProps.theme.header,
    },
    headerTintColor: screenProps.theme.text.color,
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

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id || this.state.themeChanged });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      themeChanged: false,
    };
  }

  // Update state of history screen when user makes a new request or theme changes
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.screenProps.theme._id !== this.props.screenProps.theme._id) {
      this.setState({ themeChanged: true }, () => this._updateListViewDataSource(this.props.screenProps.history));
    } else {
      this.setState({ themeChanged: false });
    }

    if (nextProps.screenProps.history !== this.props.screenProps.history) {
      this._updateListViewDataSource(nextProps.screenProps.history);
    }
  }

  _updateListViewDataSource = (history) => {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(history),
    });
  }

  _copyRequest(navigate, request) {
    this.props.screenProps.loadRequestOptions(request);
    navigate('Home', {
      requestUrl: request.url,
      requestType: request.method.toLowerCase(),
    });
  }

  render() {
    // TODO: generate UID for each object
    const { navigate } = this.props.navigation;
    if (this.state.dataSource.getRowCount() > 0) {
      return (
        <View style={{ flex: 1, ...this.props.screenProps.theme.historyContainer }}>
          <ListView
            style={{ marginHorizontal: 5, ...this.props.screenProps.theme.historyContainer }}
            enableEmptySections
            dataSource={this.state.dataSource}
            renderRow={(entry) => (
              <Card key={entry._id}>
                <CardItem header style={this.props.screenProps.theme.cardContainer}>
                  <ExpandableText style={{ fontWeight: 'bold', maxWidth: '75%', ...this.props.screenProps.theme.text }} text={entry.url} />
                  <Right>
                    <RequestBadge type={entry.method.toUpperCase()} />
                  </Right>
                </CardItem>
                <CardItem style={this.props.screenProps.theme.cardContainer}>
                  <Body>
                    <Text style={this.props.screenProps.theme.text}>
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
                <CardItem footer style={this.props.screenProps.theme.cardContainer}>
                  <Text style={this.props.screenProps.theme.text}>
                    Footer
                  </Text>
                  <Right>
                    <Text style={{ color: Colors.mainTheme }} onPress={() => this._copyRequest(navigate, entry)}>Copy Request</Text>
                  </Right>
                </CardItem>
              </Card>
            )}
            initialListSize={5}
          />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', ...this.props.screenProps.theme.container }}>
        <Text style={this.props.screenProps.theme.text}>Uh oh, you haven't made any requests yet.</Text>
        <Text style={{ color: Colors.mainTheme }} onPress={() => navigate('Home')}>Make your first request</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
});
