import 'envkey';
import ThanksCount from '../models/thanks-count';
import Article from '../models/article';
import connectToDatabase, { closeConnection } from '../index';

function addEmptyThanksToArticles (articles) {
  return Promise.all(articles.map(article => {
    return ThanksCount.create({ count: 0 })
      .then(thanksCount => {
        article.thanks = thanksCount;
        article.markModified('thanks');
        return article.save();
      });
  }));
}

connectToDatabase()
  .then(connectToDatabase)
  .then(() => {
    return Article.find()
      .then(addEmptyThanksToArticles)
      .then(() => {
        console.info('ThanksCount were created and added to all existing articles');
        closeConnection();
      })
      .catch((e:Error) => {
        global.console.error(e);
        closeConnection();
      });
  })
  .catch((e:Error) => {
    global.console.error(e);
    closeConnection();
  });
