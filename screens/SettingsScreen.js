import React from 'react';
import { ScrollView, StyleSheet, StatusBar, Platform } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
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

    render() {
    return (
      <ScrollView
        style={styles.container}
      >

        {/* Go ahead and delete ExpoConfigView and replace it with your
            * content, we just wanted to give you a quick view of your config */}
        <ExpoConfigView />

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
