const next = require('next');
const express = require('express');
const axios = require('axios');
const qs = require('query-string');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  server.get('/tweets', (req, res) => {
    const q = req.query.q || 'news';

    const params = {
      q,
      geocode: `${req.query.lat},${req.query.lng},10km`,
      include_entities: false,
      count: 100,
    };

    axios({
      url: `https://api.twitter.com/1.1/search/tweets.json?${qs.stringify(
        params,
      )}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.query.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(items => {
        res.json({
          error: false,
          items: items.data.statuses,
        });
      })
      .catch(() => {
        res.json({
          error: true,
          message: 'Something went wrong',
        });
      });
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
