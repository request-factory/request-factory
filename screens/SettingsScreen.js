import React from 'react';
import { ScrollView, StyleSheet, StatusBar, Platform, Alert, Linking } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Separator } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    tabBarLabel: 'Settings',
    headerStyle: {
      height: Platform.OS === 'ios' ? 64 : (56 + StatusBar.currentHeight),
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons
        name="settings"
        size={25}
        color={tintColor}
      />
    ),
  })

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
      <Container>
        <Content>
          <List>
            <Separator bordered>
              <Text>APPLICATION</Text>
            </Separator>
            <ListItem>
              <Text>
                  Change theme
              </Text>
            </ListItem>
            <ListItem onPress={this._clearRequestHistory}>
              <Text>
                  Delete request history
              </Text>
            </ListItem>
            <Separator bordered>
              <Text>DEVELOPMENT</Text>
            </Separator>
            <ListItem onPress={this._viewContributors}>
              <Text>
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
