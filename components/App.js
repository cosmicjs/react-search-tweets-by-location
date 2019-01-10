import React from 'react';
import PropTypes from 'prop-types';

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        {children}
        <style jsx global>
          {`
            * {
              box-sizing: border-box;
            }

            body {
              color: #222;
              font-size: 1em;
              margin: 0;
              padding: 0;
            }

            :global(.browserupgrade) {
              margin: 0.2em 0;
              background: #ccc;
              color: #000;
              padding: 0.2em 0;
            }
          `}
        </style>
      </div>
    );
  }
}

export default App;
