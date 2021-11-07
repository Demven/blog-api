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
};

export default categoriesResolvers;
