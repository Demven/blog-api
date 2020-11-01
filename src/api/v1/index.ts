import { Router as router } from 'express';

import articleRouter from './article';
import homepageSectionRouter from './homepage-section';
import categoryRouter from './category';
import keywordRouter from './keyword';
import userRouter from './user';

const v1Router = router();

v1Router.get('/status', (req, res) => {
  res.sendStatus(200);
});
v1Router.use('/article', articleRouter);
v1Router.use('/homepage-section', homepageSectionRouter);
v1Router.use('/category', categoryRouter);
v1Router.use('/keyword', keywordRouter);
v1Router.use('/user', userRouter);

export default v1Router;
