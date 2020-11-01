import 'envkey';
import Promise from 'bluebird';
import Article from '../models/article';
import connectToDatabase, { closeConnection } from '../index';

function findAllArticlesWithQuotes() {
  return Article.find({ body: { $elemMatch: { type: 'quote' } } });
}

function closeConnectionAndExit() {
  return closeConnection()
    .finally(() => {
      process.exit(0);
    });
}

connectToDatabase()
  .then(connectToDatabase)
  .then(() => {
    return findAllArticlesWithQuotes()
      .then(articles => {
        return Promise.map(articles, (article => {
          console.info('Article:', (<any>article).slug);

          (<any>article).body = (<any>article).body.map(node => {
            if (node.type === 'quote') {
              node.type = 'epigraph';
            }

            return node;
          });
          article.markModified('body');

          return article.save();
        }));
      })
      .then(() => {
        console.info('All articles are migrated');
        closeConnectionAndExit();
      })
      .catch((e:Error) => {
        global.console.error(e);
        closeConnectionAndExit();
      });
  })
  .catch((e:Error) => {
    global.console.error(e);
    closeConnectionAndExit();
  });
