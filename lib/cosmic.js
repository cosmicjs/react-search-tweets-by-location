import Cosmic from 'cosmicjs';

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
      limit: 10,
      sort: 'modified_at',
    })
    .then(item => item.objects);
}

function addHistory(title, totalTweets = 0) {
  bucket
    .getObject({ slug: title })
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
