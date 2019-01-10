import React from 'react';
import App from '../components/App';
import Flex, { Col } from '../components/Flex';
import Map from '../components/Map';
import TwitterService from '../lib/Twitter';
import fetch from '../lib/cosmic';

class Index extends React.Component {
  static async getInitialProps() {
    let twitterAccessToken;
    try {
      twitterAccessToken = await TwitterService.obtainAccessToken();
    } catch (error) {
      twitterAccessToken = '';
    }

    return {
      twitterAccessToken,
    };
  }

  state = {
    q: '',
    isLoading: false,
    tweets: [],
    mapLocation: {
      lat: 40.627307,
      lng: -73.937884,
    },
    position: {
      lat: 40.627307,
      lng: -73.937884,
    },
    popular: [],
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.setState({
          position: currentLocation,
          mapLocation: currentLocation,
        });
      });
    }

    fetch
      .getSearchHistory()
      .then(data => {
        this.setState({
          popular: data,
        });
      });
  }

  search() {
    this.setState({
      isLoading: true,
    });

    const q = this.state.q || 'news';

    TwitterService.searchTweets({
      accessToken: this.props.twitterAccessToken,
      ...this.state.position,
      q,
    }).then(tweets => {
      fetch.addHistory(q, tweets.length);
      this.setState({
        tweets,
        isLoading: false,
      });
    });
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSearch = e => {
    e.preventDefault();

    this.search();
  };

  onChangeLocation = position => {
    this.setState(
      {
        position,
      },
      () => {
        this.search();
      },
    );
  };

  onSelect = title => {
    this.setState(
      {
        q: title,
      },
      () => {
        this.search();
      },
    );
  };

  render() {
    return (
      <App>
        <Flex>
          <Col xs={8}>
            <Map
              defaultLocation={this.state.mapLocation}
              onChangeLocation={this.onChangeLocation}
            />
          </Col>
          <Col xs={4}>
            <div className="content">
              <div className="search-bar">
                <Flex xs={{ align: 'center', justify: 'space-between' }}>
                  <Col xs={8}>
                    <input
                      type="text"
                      className="input-search"
                      name="q"
                      value={this.state.q}
                      onChange={this.onChange}
                    />
                  </Col>
                  <Col>
                    <button className="btn" onClick={this.onSearch}>
                      Search
                    </button>
                  </Col>
                </Flex>
                <div className="popular-categories">
                  {this.state.popular.map((item, key) => (
                    <span
                      key={key}
                      className="category-item"
                      onClick={() => this.onSelect(item.title)}
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="tweet-container">
                {this.state.isLoading && <p>Loading...</p>}
                {!this.state.isLoading &&
                this.state.tweets.map((item, key) => (
                  <div key={key} className="tweet-item">
                    <Flex xs={{ align: 'center' }}>
                      <Col xs={{ right: 10 }}>
                        <img
                          className="profile-image"
                          src={item.user.profile_image_url_https}
                          alt="Profile"
                        />
                      </Col>
                      <Col>
                        <p><a href={`https://twitter.com/${item.user.screen_name}`} target="_blank" rel="noreferrer noopener">{item.user.name}</a></p>
                      </Col>
                    </Flex>
                    <p className="tweet-text">{item.text}</p>
                    <Flex xs={{ justify: 'flex-end' }}>
                      <Col>
                        <a href={`https://twitter.com/statuses/${item.id_str}`} target="_blank" rel="noreferrer noopener">More...</a>
                      </Col>
                    </Flex>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Flex>
        <div className="footer">
          <Flex xs={{ height: '5vh', align: 'center', justify: 'center' }}>
            Proudly Powered by &ensp; <a href="https://cosmicjs.com" target="_blank">Cosmic JS</a>
          </Flex>
        </div>
        <style jsx global>{`
          body {
            font-family: sans-serif;
          }

          a {
            color: #00A4EF;
            text-decoration: none;
          }

          p {
            margin: 0;
          }
        `}</style>
        <style jsx>
          {`
            .content {
              padding: 0 15px;
            }

            .search-bar {
              height: 10vh;
              border-radius: 10px;
              box-shadow: 0 5px 20px 0 rgba(204, 204, 204, 0.5);
              padding: 0 15px;
              margin: 10px 0;
            }

            .popular-categories {
              margin-top: 10px;
            }

            .category-item {
              color: #00A4EF;
              margin-right: 10px;
              cursor: pointer;
            }

            .tweet-container {
              height: 80vh;
              background: #fff;
              padding: 0 15px;
              overflow-y: scroll;
              border-radius: 10px;
              box-shadow: 0 5px 20px 0 rgba(204, 204, 204, 0.5);
            }

            .tweet-item {
              color: #14171a;
              border-bottom: 1px solid #e6ecf0;
              word-break: break-all;
              margin: 10px 0;
              padding-bottom: 10px;
            }

            .profile-image {
              height: 30px;
              border-radius: 50%;
              border: 1px solid #ccc;
            }

            .tweet-text {
              margin: 5px 0;
            }

            .input-search {
              width: 100%;
              box-sizing: border-box;
              border: 0;
              border-bottom: 1px solid #d3dfef;
              font-size: 14px;
              letter-spacing: 0.3px;
              padding: 14px 20px;
            }

            .btn {
              width: 100%;
              box-sizing: border-box;
              border: 0;
              border-bottom: 1px solid #d3dfef;
              font-size: 14px;
              letter-spacing: 0.3px;
              padding: 14px 20px;
              transition: all 0.2s linear;
              box-shadow: 0 4px 16px 0 rgba(69, 91, 99, 0.08);
            }

            .footer {
              width: 100%;
              background: #B9E7A7;
              color: #717171;
            }
          `}
        </style>
      </App>
    );
  }
}

Index.propTypes = {};

export default Index;
