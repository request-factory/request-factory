import React from 'react';
import { ScrollView, StyleSheet, StatusBar, Platform, Alert, Linking, Switch } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Separator, Right } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Settings',
    tabBarLabel: 'Settings',
    headerStyle: {
      height: Platform.OS === 'ios' ? 64 : (56 + StatusBar.currentHeight),
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
      ...screenProps.theme.header,
    },
    headerTintColor: screenProps.theme.text.color,
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons
        name="settings"
        size={25}
        color={tintColor}
      />
    ),
  })

  constructor(props) {
    super(props);
    this.state = {
      switchToggled: false,
    };
  }

  _toggleTheme = (value) => {
    this.setState({ switchToggled: value });
    this.props.screenProps.toggleNightMode(value);
  }

  _clearRequestHistory = () => {
    Alert.alert(
      'DELETE HISTORY?',
      'All requests in your history will be deleted from the device.',
      [
        { text: 'Cancel' },
        { text: 'Ok', onPress: () => this.props.screenProps.clearRequestHistory() },
      ]
    );
  }

  _viewContributors = () => {
    Linking.openURL('https://github.com/jessecordeiro/supernova-mobile/graphs/contributors');
  }

  render() {
    return (
      <Container style={this.props.screenProps.theme.container}>
        <Content>
          <List>
            <Separator bordered style={this.props.screenProps.theme.separator}>
              <Text>APPLICATION</Text>
            </Separator>
            <ListItem>
              <Text style={this.props.screenProps.theme.text}>
                  Night Mode
              </Text>
              <Right>
                <Switch
                  onValueChange={(value) => this._toggleTheme(value)}
                  value={this.state.switchToggled}
                />
              </Right>
            </ListItem>
            <ListItem onPress={this._clearRequestHistory}>
              <Text style={this.props.screenProps.theme.text}>
                  Delete Request History
              </Text>
            </ListItem>
            <Separator bordered style={this.props.screenProps.theme.separator}>
              <Text>
                DEVELOPMENT
              </Text>
            </Separator>
            <ListItem onPress={this._viewContributors}>
              <Text style={this.props.screenProps.theme.text}>
                  Contributors
              </Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
