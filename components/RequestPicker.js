import React from 'react';
import { Picker } from 'native-base';
import { StyleSheet, View } from 'react-native';
import styles from '../styles/homeScreen/style';
import { requestColours } from '..//common/helpers';

export class RequestPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colour: '#039be5',
    };

    this.state.colour = requestColours(this.props.type);
  }

  render() {
    this.state.colour = requestColours(this.props.type);
    console.log(this.state.colour);
    return (
      <View style={[styles.requestPicker, { backgroundColor: this.state.colour }]} >
        <Picker
          style={{ width: 160, height: 35, color: 'white' }}
          mode="dropdown"
          selectedValue={this.props.type}
          onValueChange={(value) => this.props.updatePick(value)}
        >
          <Picker.Item label="GET" value="get" />
          <Picker.Item label="PUT" value="put" />
          <Picker.Item label="POST" value="post" />
          <Picker.Item label="PATCH" value="patch" />
          <Picker.Item label="DELETE" value="delete" />
          <Picker.Item label="COPY" value="copy" />
          <Picker.Item label="HEAD" value="head" />
          <Picker.Item label="OPTIONS" value="options" />
          <Picker.Item label="LINK" value="link" />
          <Picker.Item label="UNLINK" value="unlink" />
          <Picker.Item label="PURGE" value="purge" />
          <Picker.Item label="LOCK" value="lock" />
          <Picker.Item label="UNLOCK" value="unlock" />
          <Picker.Item label="PROPFIND" value="propfind" />
          <Picker.Item label="VIEW" value="view" />
        </Picker>
      </View>
    );
  }
}
