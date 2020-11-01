const generateSlug = require('slug');
import Promise from 'bluebird';
import mongoose from 'mongoose';
import { Router as expressRouter, Request, Response, NextFunction } from 'express';
import Article from '../../dal/models/article';
import Image from '../../dal/models/image';
import ViewsCount from '../../dal/models/views-count';
import { authorization, processAuthError } from '../authorization';

const router = expressRouter();

router.get('/popular', (req:Request, res:Response, next:NextFunction) => {
  const { limit = '10' } = req.query;

  function findTopViews() {
    return ViewsCount
      .find({})
      .sort({ count: -1 })
      .limit(parseInt(<string>limit, 10))
      .exec();
  }

  function findArticlesByViews(views) {
    const articlePromises = views.map(view => {
      return Article
        .findOne({ views: mongoose.Types.ObjectId(view._id) }, 'slug title image category views')
        .populate('image category views')
        .exec();
    });

    return Promise.all(articlePromises);
  }

  findTopViews()
    .then(findArticlesByViews)
    .then(articles => {
      if (articles) {
        res.json(articles);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(error => next(error));
});

router.get('/:slug', (req:Request, res:Response, next) => {
  const slug:string = req.params.slug;
  const ignorePageView = req.query.ignore ? req.query.ignore === 'pageview' : false;

  function findArticleAndPopulate(articleSlug: string) {
    return Article
      .findOne({ slug: articleSlug })
      .populate('image category keywords views')
      .exec();
  }

  function incrementViewsCount(article: any) {
    if (!ignorePageView && article) {
      const views = article.views;

      ViewsCount
        .findOneAndUpdate({ _id: views._id }, { $inc: { 'count': 1 } })
        .exec();

      return article;
    }

    return article;
  }

  findArticleAndPopulate(slug)
    .then(incrementViewsCount)
    .then(article => {
      if (article) {
        res.json(article);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(error => next(error));
});

router.post('/', authorization, processAuthError, (req:Request, res:Response, next) => {
  const article = req.body;
  const createMainImage = () => Image.create(article.image);
  const createViewsCount = () => ViewsCount.create({ count: 0 });

  if (article.slug) {
    // update
    Article
      .findOne({ slug: article.slug })
      .populate('image category keywords')
      .then((articleFromDb: any) => {
        let imagePromise:any = Promise.resolve(article.image);
        if (articleFromDb.image.url !== article.image.url) {
          imagePromise = Image
            .findOne({ url: article.image.url })
            .then(image => {
              if (image) {
                // reuse existing image
                return image;
              } else {
                return createMainImage();
              }
            });
        }

        imagePromise
          .then((mainImage:Object) => {
            article.image = mainImage;

            (<any>Article)
              .updateOne({ slug: article.slug }, article)
              .then((updatedArticle:Object) => {
                if (updatedArticle) {
                  res.json(updatedArticle);
                } else {
                  res.sendStatus(500);
                }
              })
              .catch(error => next(error));
          });
      })
      .catch(error => next(error));
  } else {
    // create
    article.slug = generateSlug(article.title).toLowerCase();

    Promise
      .all([
        createMainImage(),
        createViewsCount(),
      ])
      .then(([mainImage, viewsCount]: [Object, Object]) => {
        article.image = mainImage;
        article.views = viewsCount;
        delete article.publication_date;

        Article
          .create(article)
          .then(createdArticle => {
            if (createdArticle) {
              res.json(createdArticle);
            } else {
              res.sendStatus(500);
            }
          })
          .catch(error => next(error));
      });
  }
});

export default router;
