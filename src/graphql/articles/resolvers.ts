import mongoose from 'mongoose';
import generateSlug from 'slug';
import Article from '../../dal/models/article';
import ViewsCount from '../../dal/models/views-count';
import ThanksCount from '../../dal/models/thanks-count';
import Image from '../../dal/models/image';
import ArticleDto from '../../types/ArticleDto';

const articlesResolvers = {
  article: ({ slug, ignorePageView = false }) => {
    function findArticleAndPopulate(articleSlug:string) {
      return Article
        .findOne({ slug: articleSlug })
        .populate('image category keywords views thanks')
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

  sitemapArticles: () => {
    return Article
      .find({}, 'slug image last_updated')
      .populate('image')
      .sort({ last_updated: 'desc' })
      .exec();
  },

  createArticle: ({ article }: { article:ArticleDto }) => {
    return Promise.all([
        Image.create(article.image),
        ViewsCount.create({ count: 0 }),
        ThanksCount.create({ count: 0 }),
      ])
      .then(([mainImage, viewsCount, thanksCount]: [Object, Object, Object]) => {
        return Article.create({
          ...article,
          slug: generateSlug(article.title).toLowerCase(),
          image: mainImage,
          views: viewsCount,
          thanks: thanksCount,
          publication_date: null,
        });
      });
  },

  updateArticle: async ({ article }: { article:ArticleDto }) => {
    const existingArticle:any = await Article
      .findOne({ slug: article.slug })
      .populate('image category keywords');

    let imagePromise:Promise<any> = Promise.resolve(article.image);
    if (existingArticle.image && existingArticle.image.url !== article.image.url) {
      imagePromise = Image
        .findOne({ url: article.image.url })
        .then(image => {
          if (image) {
            // reuse existing image
            return image;
          } else {
            return Image.create(article.image);
          }
        });
    }

    const mainImage = await imagePromise;

    return Article.updateOne({ slug: article.slug }, {
      ...article,
      image: mainImage,
    })
      .then(updateResult => updateResult?.ok === 1 ? article : null);
  },
};

export default articlesResolvers;
