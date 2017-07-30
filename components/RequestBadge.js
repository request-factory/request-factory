import React from 'react';
import { Badge, Text } from 'native-base';

export class RequestBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      colour: '#039be5',
    };

    switch (this.state.type) {
      case 'GET':
        this.state.colour = '#ba68c8';
        break;
      case 'PUT':
        this.state.colour = '#4db6ac';
        break;
      case 'POST':
        this.state.colour = '#e57373';
        break;
      case 'DELETE':
        this.state.colour = '#ffb74d';
        break;
      default:
        this.state.colour = '#039be5';
    }
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
