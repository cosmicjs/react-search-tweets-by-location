import React from 'react';
import PropTypes from 'prop-types';
import { getViewPortConfig, getColumnStyles } from '../../../utils/flex';

class Col extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {},
      viewPortConfig: {},
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    // Initial resize call
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const { xl, lg, md, sm, xs, debug } = this.props;

    if (!xl && !lg && !md && !sm && !xs) {
      return;
    }

    const viewPortConfig = getViewPortConfig(window.innerWidth, {
      xl,
      lg,
      md,
      sm,
      xs,
    });

    if (debug) {
      console.log('----viewPortConfig----', viewPortConfig);
    }

    this.setState({
      viewPortConfig,
      style: getColumnStyles(viewPortConfig),
    });
  };

  render() {
    const { viewPortConfig } = this.state;

    const wrapperStyle = {
      paddingLeft: viewPortConfig.left || 0,
      paddingRight: viewPortConfig.right || 0,
      paddingTop: viewPortConfig.top || 0,
      paddingBottom: viewPortConfig.bottom || 0,
    };

    return (
      <div
        style={{
          ...this.state.style,
          ...wrapperStyle,
        }}
        className={this.props.className}
      >
        {this.props.children}
      </div>
    );
  }
}

const shape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({
    size: PropTypes.number,
    offset: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
  }),
]);

Col.propTypes = {
  className: PropTypes.string,
  debug: PropTypes.bool,
  xl: shape,
  lg: shape,
  md: shape,
  sm: shape,
  xs: shape,
  children: PropTypes.node,
};

Col.defaultProps = {
  children: '',
  className: '',
  debug: false,
  xl: null,
  lg: null,
  md: null,
  sm: null,
  xs: null,
};

export default Col;
