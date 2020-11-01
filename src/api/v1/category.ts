import { Router as expressRouter, Request, Response } from 'express';
import Category from '../../dal/models/category';
import Article from '../../dal/models/article';

const router = expressRouter();

router.get('/', (req:Request, res:Response, next) => {
  Category
    .find()
    .then(categories => {
      res.json(categories);
    })
    .catch(error => next(error));
});

router.get('/:categorySlug/articles', (req:Request, res:Response, next) => {
  const categorySlug:string = req.params.categorySlug;
  const title = req.query.title || '';
  const limit = req.query.limit ? parseInt(<string>req.query.limit, 10) : 5;

  Category
    .findOne({ slug: categorySlug })
    .then((category:any) => {
      if (category) {
        const query = { 'category': category._id };
        const exclude = { body: 0 };

        if (title) {
          query['title'] = new RegExp(<string>title, 'i');
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
        res.status(404).send('Category with such slug does not exist');
      }
    })
    .catch(error => next(error));
});

export default router;
