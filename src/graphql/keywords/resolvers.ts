import generateSlug from 'slug';
import Keyword from '../../dal/models/keyword';
import Article from '../../dal/models/article';

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

  keywordArticles: async ({
    keywordSlug = '',
    articleTitleSearch = '',
    limit = 5,
  }) => {
    const keyword = await Keyword.findOne({ slug: keywordSlug });

    if (keyword) {
      const query:any = { keywords: keyword._id };
      const exclude = { body: 0 };

      if (articleTitleSearch) {
        query.title = new RegExp(articleTitleSearch, 'i');
      }

      return Article
        .find(query, exclude)
        .limit(limit)
        .populate('image views')
        .exec();
    } else {
      return [];
    }
  },

  createKeyword: async ({ name = '' }) => {
    if (name) {
      const slug = generateSlug(name).toLowerCase();
      const existingKeyword = await Keyword.findOne({ slug });

      if (existingKeyword) {
        return existingKeyword;
      } else {
        return Keyword.create({ name, slug });
      }
    } else {
      return null;
    }
  },
};

export default keywordsResolvers;
