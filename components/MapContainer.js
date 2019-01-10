import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import { MAP } from 'react-google-maps/lib/constants';
import _ from 'lodash';

class MapContainer extends Component {
  static contextTypes = { [MAP]: PropTypes.shape({}) };

  constructor(props) {
    super(props);

    this.state = {
      position: props.defaultLocation,
    };
  }

  onClick = e => {
    const position = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    this.setState(
      {
        position,
      },
      () => {
        this.props.onChangeLocation(position);
      },
    );
  };

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.defaultLocation, this.props.defaultLocation)) {
      this.setState({
        position: this.props.defaultLocation,
      }, () => {
        this.context[MAP].setCenter(this.props.defaultLocation);
      });
    }
  }

  render() {
    const { position } = this.state;

    return (
      <GoogleMap
        ref={elem => (this.map = elem)}
        zoom={9}
        defaultCenter={position}
        onClick={this.onClick}
      >
        <Marker
          position={position}
          draggable
          icon={{
            url: '/static/twitter.png',
            size: new google.maps.Size(32, 32),
          }}
          title="You"
        />
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(MapContainer));
