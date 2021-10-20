import Article from '../../dal/models/article';
import ThanksCount from '../../dal/models/thanks-count';

const thanksCountResolvers = {
  thanksFor: async ({ articleId = '' }) => {
    if (articleId) {
      const article:any = await Article.findById(articleId);

      if (article?.thanks?._id) {
        return ThanksCount
          .findOneAndUpdate({ _id: article.thanks._id }, { $inc: { 'count': 1 } })
          .exec()
          .then(() => true)
          .catch(() => false);
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
};

export default thanksCountResolvers;
