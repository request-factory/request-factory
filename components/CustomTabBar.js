import React from 'react';
import { TabBarBottom } from 'react-navigation';

export default class CustomTabBar extends React.Component {
  render() {
    return (
      <TabBarBottom
        {...this.props}
        style={this.props.screenProps.theme.tabBar}
      />
    );
  }
}
