import React from 'react';
import { Badge, Text } from 'native-base';
import { requestColours } from '../common/helpers';

export class RequestBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      colour: '#039be5',
    };

    this.state.colour = requestColours(this.state.type);
  }

  render() {
    return (
      <Badge style={{ backgroundColor: this.state.colour }} >
        <Text>
          {this.state.type}
        </Text>
      </Badge>
    );
  }
}
