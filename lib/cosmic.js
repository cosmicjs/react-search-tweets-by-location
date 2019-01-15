import Cosmic from 'cosmicjs';
import _ from 'lodash';

const api = Cosmic();
const bucket = api.bucket({
  slug: process.env.COSMIC_BUCKET,
  read_key: process.env.COSMIC_READ_KEY,
  write_key: process.env.COSMIC_WRITE_KEY,
});

function getSearchHistory() {
  return bucket
    .getObjects({
      type: 'searches',
      limit: 100,
      sort: 'modified_at',
    })
    .then(item => {
      return _.take(_.orderBy(item.objects, i => i.metadata.searchCounts, ['desc']), 10)
    });
}

function addHistory(title, totalTweets = 0) {
  bucket
    .getObject({ slug: _.lowerCase(title) })
    .then(data => {
      const obj = data.object;

      return bucket.editObject({
        slug: obj.slug,
        metafields: [
          {
            key: 'searchCounts',
            type: 'text',
            value: obj.metadata.searchCounts + 1,
          },
          {
            key: 'totalTweets',
            type: 'text',
            value: totalTweets,
          },
        ],
      });
    })
    .catch(() => {
      const params = {
        title,
        type_slug: 'searches',
        content: '',
        metafields: [
          {
            key: 'searchCounts',
            type: 'text',
            value: 1,
          },
          {
            key: 'totalTweets',
            type: 'text',
            value: totalTweets,
          },
        ],
        options: {
          slug_field: false,
        },
      };

      return bucket.addObject(params);
    });
}

export default {
  getSearchHistory,
  addHistory,
};
