import Keyword from '../../dal/models/keyword';

const keywordsResolvers = {
  keywords: ({ search = '', limit = 5 }) => {
    const query = {};
    if (search) {
      query['name'] = new RegExp(<string>search, 'i');
    }

    return Keyword
      .find(query)
      .limit(limit)
      .exec();
  },
};

export default keywordsResolvers;
