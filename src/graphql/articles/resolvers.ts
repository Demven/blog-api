import mongoose from 'mongoose';
import Article from '../../dal/models/article';
import ViewsCount from '../../dal/models/views-count';

const articlesResolvers = {
  article: ({ slug, ignorePageView = false }) => {
    function findArticleAndPopulate(articleSlug:string) {
      return Article
        .findOne({ slug: articleSlug })
        .populate('image category keywords views')
        .exec();
    }

    function incrementViewsCount(article:any) {
      if (!ignorePageView && article) {
        const views = article.views;

        ViewsCount
          .findOneAndUpdate({ _id: views._id }, { $inc: { 'count': 1 } })
          .exec();

        return article;
      }

      return article;
    }

    return findArticleAndPopulate(slug)
      .then(incrementViewsCount);
  },

  popularArticles: ({ limit = 10 }) => {
    function findTopViews() {
      return ViewsCount
        .find({})
        .sort({ count: -1 })
        .limit(limit)
        .exec();
    }

    function findArticlesByViews(views) {
      return Promise.all(views.map(view => {
        return Article
          .findOne({ views: mongoose.Types.ObjectId(view._id) }, 'slug title image category views')
          .populate('image category views')
          .exec();
      }));
    }

    return findTopViews()
      .then(findArticlesByViews);
  },
};

export default articlesResolvers;
