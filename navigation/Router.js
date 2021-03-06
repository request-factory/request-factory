import { TabNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

import Colors from '../constants/Colors';
import CustomTabBar from '../components/CustomTabBar';

export default TabNavigator({
  Home: {
    screen: HomeScreen,
  },
  History: {
    screen: HistoryScreen,
  },
  Settings: {
    screen: SettingsScreen,
  },
}, {
  animationEnabled: true,
  swipeEnabled: false,
  tabBarPosition: 'bottom',
  tabBarComponent: CustomTabBar,
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    inactiveTintColor: Colors.greyColour,
    activeTintColor: Colors.mainTheme,
    pressColor: Colors.mainTheme,
    style: {
      backgroundColor: Colors.whiteColour,
    },
    indicatorStyle: {
      backgroundColor: Colors.mainTheme,
    },
  },
});
