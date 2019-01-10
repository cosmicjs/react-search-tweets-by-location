import axios from 'axios';
import qs from 'query-string';

class TwitterService {
  static obtainAccessToken() {
    const options = {
      url: 'https://api.twitter.com/oauth2/token',
      method: 'POST',
      headers: {
        Authorization: `Basic Q1dVeGFwb1FnT2U4WlAzMXpkeXZ1NUdQeTpHZm53dlZPajdhc1BRWFBDekw0ZHNPQmE3Qk1LRHNoOHhCa25MYjE5RWtyTmlaWXlQYg==`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type: 'client_credentials',
      }),
    };

    return axios(options).then(res => res.data.access_token);
  }

  static searchTweets(params) {
    const options = {
      url: `/tweets?${qs.stringify(params)}`,
      method: 'GET',
    };

    return axios(options).then(res => res.data.items);
  }
}

export default TwitterService;
