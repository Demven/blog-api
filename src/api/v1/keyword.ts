import { Router as expressRouter, Request, Response } from 'express';
import generateSlug from 'slug';
import Keyword from '../../dal/models/keyword';
import Article from '../../dal/models/article';
import { authorization, processAuthError } from '../authorization';

const router = expressRouter();

router.get('/', (req:Request, res:Response, next) => {
  const search = req.query.search || '';
  const limit = req.query.limit ? parseInt(<string>req.query.limit, 10) : 5;

  const query = {};
  if (search) {
    query['name'] = new RegExp(<string>search, 'i');
  }

  Keyword
    .find(query)
    .limit(limit)
    .exec()
    .then(keywords => {
      res.json(keywords);
    })
    .catch(error => next(error));
});

router.get('/:keywordSlug/articles', (req:Request, res:Response, next) => {
  const keywordSlug:string = req.params.keywordSlug;
  const name = req.query.name || '';
  const limit = req.query.limit ? parseInt(<string>req.query.limit, 10) : 5;

  Keyword
    .findOne({ slug: keywordSlug })
    .then((keyword:any) => {
      if (keyword) {
        const query:any = { keywords: keyword._id };
        const exclude = { body: 0 };

        if (name) {
          query.title = new RegExp(<string>name, 'i');
        }

        Article
          .find(query, exclude)
          .limit(limit)
          .populate('image views')
          .exec()
          .then(articles => {
            if (articles) {
              res.json(articles);
            } else {
              res.sendStatus(404);
            }
          })
          .catch(error => next(error));
      } else {
        res.status(404).send('Keyword with such slug does not exist');
      }
    })
    .catch(error => next(error));
});

router.post('/', authorization, processAuthError, (req:Request, res:Response, next) => {
  const name = req.body.keyword;

  if (name) {
    const slug = generateSlug(name).toLowerCase();

    Keyword
      .findOne({ slug })
      .then(foundedKeyword => {
        if (foundedKeyword) {
          res.json(foundedKeyword);
        } else {
          Keyword
            .create({ name, slug })
            .then(createdKeyword => {
              if (createdKeyword) {
                res.json(createdKeyword);
              } else {
                res.sendStatus(500);
              }
            })
            .catch(error => next(error));
        }
      });
  } else {
    res.sendStatus(400);
  }
});

export default router;
