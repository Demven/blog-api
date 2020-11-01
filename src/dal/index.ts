import mongoose, { Connection } from 'mongoose';
import Promise from 'bluebird';
require('./models/image');
require('./models/category');
require('./models/keyword');
require('./models/article');
require('./models/homepage-section');
require('./models/views-count');

const {
  NODE_ENV,
  MONGODB_APP_NAME,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_HOST,
  MONGODB_PORT,
} = process.env;

require('mongoose').Promise = require('bluebird');

export default function connectToDatabase(): Promise<Connection> {
  let connectionURI:string;
  if (NODE_ENV === 'production' && MONGODB_USERNAME) {
    connectionURI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_APP_NAME}`;
  } else {
    connectionURI = `mongodb://${MONGODB_HOST}/${MONGODB_APP_NAME}`;
  }

  console.info(`Connect to the database: ${connectionURI}...`);

  const options = { useFindAndModify: false };

  return new Promise((resolve, reject) => {
    mongoose.connect(connectionURI, options, (error: Error) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.info('Connected');
        resolve(mongoose.connection);
      }
    });
  });
}

export function closeConnection() {
  return Promise.resolve(mongoose.disconnect(() => {
    console.info('Mongodb connection is closed');
  }));
}
