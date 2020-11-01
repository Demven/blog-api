import { Router as expressRouter, Request, Response } from 'express';
import Promise from 'bluebird';
import HomepageSection from '../../dal/models/homepage-section';
import Article from '../../dal/models/article';
import { authorization, processAuthError } from '../authorization';

const router = expressRouter();

router.get('/', (req:Request, res:Response, next) => {
  HomepageSection
    .find()
    .sort({ order: 'asc' })
    .populate('category')
    .populate({
      path: 'articles',
      populate: { path: 'image category views' },
      select: '-body',
    })
    .exec()
    .then(sections => {
      if (sections instanceof Array) {
        res.json(sections);
      } else {
        res.sendStatus(500);
      }
    })
    .catch(error => next(error));
});

router.post('/', authorization, processAuthError, (req:Request, res:Response, next) => {
  const homepageSection = req.body;

  if (!homepageSection.articles || homepageSection.articles.length !== 5) {
    return res.status(400).send('You must provide an array of `articles` to assign to the homepage section');
  } else if (!homepageSection._id) {
    return res.status(400).send('You must provide an `_id` for the homepage section');
  }

  function findHomepageArticles(articles: Array<any>) {
    return Promise.map(articles, (article:any) => {
      return new Promise(resolve => {
        Article
          .findById(article._id)
          .then(resolve);
      });
    });
  }

  return findHomepageArticles(homepageSection.articles)
    .then((articlesFromDb: Array<any>) => {
      HomepageSection
        .findByIdAndUpdate(homepageSection._id, { $set: { articles: articlesFromDb } })
        .then(updatedHomepageSection => {
          if (updatedHomepageSection) {
            res.json(updatedHomepageSection);
          } else {
            res.sendStatus(500);
          }
        });
    })
    .catch(error => next(error));
});

export default router;
