import { StackNavigator } from 'react-navigation';
import HomeNavigator from './Router';

export default StackNavigator({
  Home: { screen: HomeNavigator },
}, {
  mode: 'modal',
});
