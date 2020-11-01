import 'envkey';
import Keyword from '../models/keyword';
import Article from '../models/article';
import connectToDatabase, { closeConnection } from '../index';

function createKeywords() {
  return Keyword.create([
    { name: 'Dmitry Salnikov',  slug: 'dmitry-salnikov' },
    { name: 'robotics',  slug: 'robotics' },
    { name: 'programming', slug: 'programming' },
    { name: 'psychology', slug: 'psychology' },
    { name: 'philosophy',  slug: 'philosophy' },
    { name: 'physics',  slug: 'physics' },
  ]);
}

function findAllArticlesAndAddEmptyKeywords(keywords: Array<Object>) {
  return Article.updateMany({}, { keywords: [keywords[0]] });
}

connectToDatabase()
  .then(connectToDatabase)
  .then(() => {
    return createKeywords()
      .then(findAllArticlesAndAddEmptyKeywords)
      .then(() => {
        console.info('Keywords were created and added to all existing articles');
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
