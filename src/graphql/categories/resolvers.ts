import Category from '../../dal/models/category';
import Article from '../../dal/models/article';

const categoriesResolvers = {
  categories: () => {
    return Category.find();
  },

  categoryArticles: async ({
    categorySlug = '',
    articleTitleSearch = '',
    limit = 5,
  }) => {
    const category = await Category.findOne({ slug: categorySlug });

    if (category) {
      const query:any = { category: category._id };
      const exclude = { body: 0 };

      if (articleTitleSearch) {
        query.title = new RegExp(articleTitleSearch, 'i');
      }

      return Article
        .find(query, exclude)
        .sort({ publication_date: 'desc' })
        .limit(limit)
        .populate('image views')
        .exec();
    } else {
      return [];
    }
  },

  mostPopularInCategory: async ({
    categorySlug = '',
    limit = 3,
  }) => {
    const category = await Category.findOne({ slug: categorySlug });

    return category
      ? await Article
        .aggregate([
          { $match: { category: category._id } },
          {
            $project: {
              body: 0,
            },
          },
          {
            $lookup: {
              from: 'viewscounts',
              localField: 'views',
              foreignField: '_id',
              as: 'views',
            },
          },
          {
            $lookup: {
              from: 'images',
              localField: 'image',
              foreignField: '_id',
              as: 'image',
            },
          },
          { $unwind: '$views' },
          { $unwind: '$image' },
          { $sort: { 'views.count': -1 } },
          { $limit: limit },
        ])
      : [];
  },
};

export default categoriesResolvers;
