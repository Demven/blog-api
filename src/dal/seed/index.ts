import 'envkey';
import { Connection } from 'mongoose';
import Promise from 'bluebird';
import User, { USER_TYPE } from '../models/user';
import Category from '../models/category';
import Image from '../models/image';
import Article from '../models/article';
import ViewsCount from '../models/views-count';
import ThanksCount from '../models/thanks-count';
import HomepageSection from '../models/homepage-section';
import connectToDatabase, { closeConnection } from '../../dal';

function createUsers() {
  return User.create([
    {
      name: 'Demven',
      password: '1234',
      type: USER_TYPE.ADMIN,
    },
  ]);
}

function createCategories() {
  return Category.create([
    {
      title: 'robotics',
      slug: 'robotics',
      color: 'blue',
    },
    {
      title: 'programming',
      slug: 'programming',
      color: 'green',
    },
    {
      title: 'thoughts',
      slug: 'thoughts',
      color: 'red',
    },
  ]);
}

function createImages() {
  return Image.create([
    {
      url: 'https://res.cloudinary.com/ds-blog/image/upload/v1510450104/hectapod_g8aohi.jpg',
      description: 'spider',
      credits: 'Google Images',
    },
    {
      url: 'https://res.cloudinary.com/ds-blog/image/upload/v1510450155/article-image_tin8wp.jpg',
      description: 'This is how it looks like to be a humanoid bot',
      credits: 'Google Images',
    },
  ]);
}

function createArticles([users, categories, images]: [Array<Object>, Array<Object>, Array<Object>]): any {
  return Promise.all([
    ViewsCount.create({ count: 0 }),
    ThanksCount.create({ count: 0 }),
  ])
    .then(([viewsCount, thanksCount]) => {
      return Article
        .create([
          {
            title: 'Octagon Nine: how to make a personal spider',
            description: 'Find out how to make your own personal assistant without significant efforts and help you to deal with more important thins instead of washing your plates or cleaning floors.',
            slug: 'octagon-nine-how-to-make-a-personal-spider',
            image: images[0],
            category: categories[0],
            views: viewsCount,
            thanks: thanksCount,
            body: [
              {
                type: 'text',
                text: 'Robotics is the interdisciplinary branch of engineering and science that includes mechanical engineering, electrical engineering, computer science, and others. Robotics deals with the design, construction, operation, and use of robots,[1] as well as computer systems for their control, sensory feedback, and information processing.',
              },
              {
                type: 'text',
                text: 'These technologies are used to develop machines that can substitute for humans. Robots can be used in any situation and for any purpose, but today many are used in dangerous environments (including bomb detection and de-activation), manufacturing processes, or where humans cannot survive. Robots can take on any form but some are made to resemble humans in appearance. This is said to help in the acceptance of a robot in certain replicative behaviors usually performed by people. Such robots attempt to replicate walking, lifting, speech, cognition, and basically anything a human can do. Many of today\'s robots are inspired by nature, contributing to the field of bio-inspired robotics.',
              },
              {
                type: 'inline-image',
                url: 'https://res.cloudinary.com/ds-blog/image/upload/v1510450155/article-image_tin8wp.jpg',
                credits: 'Google Images',
                description: 'This is how it looks like to be a humanoid bot',
              },
              {
                type: 'text',
                text: 'The concept of creating machines that can operate autonomously dates back to classical times, but research into the functionality and potential uses of robots did not grow substantially until the 20th century. Throughout history, it has been frequently assumed that robots will one day be able to mimic human behavior and manage tasks in a human-like fashion. Today, robotics is a rapidly growing field, as technological advances continue; researching, designing, and building new robots serve various practical purposes, whether domestically, commercially, or militarily. Many robots are built to do jobs that are hazardous to people such as defusing bombs, finding survivors in unstable ruins, and exploring mines and shipwrecks. Robotics is also used in STEM (Science, Technology, Engineering, and Mathematics).',
              },
            ],
          },
        ])
        .then(articles => [categories, images, articles]);
    });
}

function createHomepageSections([categories, images, articles]: [Array<Object>, Array<Object>, Array<Object>]) {
  return HomepageSection.create([
    {
      category: categories[0],
      articles: [articles[0], articles[0], articles[0], articles[0], articles[0]],
      order: 1,
    },
    {
      category: categories[1],
      articles: [articles[0], articles[0], articles[0], articles[0], articles[0]],
      order: 2,
    },
    {
      category: categories[2],
      articles: [articles[0], articles[0], articles[0], articles[0], articles[0]],
      order: 3,
    },
  ]);
}

function dropDatabase(connection: Connection) {
  return new Promise(resolve => {
    console.info('Drop database...');
    (<any>connection.db).dropDatabase(() => {
      console.info('Dropped');
      resolve();
    });
  });
}

connectToDatabase()
  .then(dropDatabase)
  .then(closeConnection)
  .then(connectToDatabase)
  .then(() => {
    return Promise
      .all([
        createUsers(),
        createCategories(),
        createImages(),
      ])
      .then(createArticles)
      .then(createHomepageSections)
      .then(() => {
        console.info('Database is seeded with the new data');
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
