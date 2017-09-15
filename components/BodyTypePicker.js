import React from 'react';
import { Picker } from 'native-base';
import { View } from 'react-native';

export class BodyTypePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{ borderWidth: 0.5, borderColor: '#d6d7da', ...this.props.screenProps.theme.tabBar }} >
        <Picker
          style={{ width: '100%', height: 50, color: 'black', ...this.props.screenProps.theme.text }}
          mode="dialog"
          selectedValue={this.props.type}
          onValueChange={(value) => this.props.updatePick(value)}
        >
          <Picker.Item label="form-data" value="form-data" />
          <Picker.Item label="x-www-form-urlencoded" value="x-www-form-urlencoded" />
          <Picker.Item label="raw" value="raw" />
        </Picker>
      </View>
    );
  }
}
