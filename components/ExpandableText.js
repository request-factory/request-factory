import React from 'react';
import { Text } from 'react-native';

export class ExpandableText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      truncated: 1,
    };
  }

  _handleTruncate = () => {
    const isTruncated = this.state.truncated;
    this.setState({
      truncated: 1 - isTruncated,
    });
  }

  render() {
    return (
      <Text
        numberOfLines={this.state.truncated}
        onPress={this._handleTruncate}
      >
        {this.state.text}
      </Text>
    );
  }
}
