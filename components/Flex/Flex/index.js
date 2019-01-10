import React from 'react';
import PropTypes from 'prop-types';

import { getViewPortConfig, getRowStyles } from '../../../utils/flex';

class Flex extends React.Component {
  state = {
    style: {},
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    // Initial resize call
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const viewPortConfig = getViewPortConfig(window.innerWidth, {
      xl: this.props.xl,
      lg: this.props.lg,
      md: this.props.md,
      sm: this.props.sm,
      xs: this.props.xs,
    });

    this.setState({
      style: getRowStyles(viewPortConfig),
    });
  };

  render() {
    return (
      <div className="root" style={this.state.style}>
        {this.props.children}
        <style>{`
          .root {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            box-sizing: border-box;
          }
        `}</style>
      </div>
    );
  }
}

const shape = PropTypes.shape({
  align: PropTypes.string,
  justify: PropTypes.string,
  wrap: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

Flex.propTypes = {
  xl: shape,
  lg: shape,
  md: shape,
  sm: shape,
  xs: shape,
  children: PropTypes.node.isRequired,
};

Flex.defaultProps = {
  xl: null,
  lg: null,
  md: null,
  sm: null,
  xs: null,
};

export default Flex;
