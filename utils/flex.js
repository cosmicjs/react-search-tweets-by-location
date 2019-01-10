/**
 * Calculates flex basis based on 12 item grid
 * @param size
 */
const calculateSize = size => `${(100 / 12) * size}%`;

/**
 * Detect configuration based on view port size
 * and given config
 * @param width Window width
 * @param config configuration object
 * @returns {*}
 */
const getViewPortConfig = (width, config) => {
  const sizes = [
    {
      name: 'xl',
      isDetected: width >= 1200,
      value: config.xl || false,
    },
    {
      name: 'lg',
      isDetected: width >= 992,
      value: config.lg || false,
    },
    {
      name: 'md',
      isDetected: width >= 768,
      value: config.md || false,
    },
    {
      name: 'sm',
      isDetected: width >= 576,
      value: config.sm || false,
    },
    {
      name: 'xs',
      isDetected: width >= 0,
      value: config.xs || false,
    },
  ];

  for (let i = 0; i < sizes.length; i += 1) {
    const size = sizes[i];
    // we detected screen size
    if (size.isDetected && size.value) {
      return size.value;
    }
  }

  return false;
};

/**
 * Return flex row styles based on config
 * Available styles
 * - align:
 * - justify:
 * - wrap:
 * - height
 * @param config
 * @returns {{}}
 */
const getRowStyles = config => ({
  alignItems: config.align || 'stretch',
  justifyContent: config.justify || 'flex-start',
  flexWrap: config.wrap || false,
  height: config.height || 'auto',
  ...config,
});

/**
 * Return flex column styles based on config
 * When given integer calculates flex-basis
 * Available styles
 * - size:
 * - offset:
 * - left:
 * - right:
 * - top:
 * - bottom:
 * @param config
 * @returns {{}}
 */
const getColumnStyles = config => {
  if (typeof config === 'number') {
    return {
      flexBasis: calculateSize(config),
    };
  }

  const { size, offset, ...rest } = config;

  return {
    flexBasis: size ? calculateSize(size) : 'auto',
    marginLeft: offset ? calculateSize(offset) : 0,
    ...rest,
  };
};

export { getViewPortConfig, getRowStyles, getColumnStyles, calculateSize };
