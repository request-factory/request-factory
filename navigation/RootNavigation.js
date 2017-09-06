import { StackNavigator } from 'react-navigation';
import HomeNavigator from './Router';
import RequestOptionsScreen from '../screens/RequestOptionsScreen';

export default StackNavigator({
  Home: {
    screen: HomeNavigator,
  },
  RequestOptions: {
    screen: RequestOptionsScreen,
  },
}, {
  mode: 'modal',
});
