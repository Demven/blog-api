import 'envkey';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import connectToDatabase from './dal';
import apiV1Router from './api/v1';
import graphqlServer from './graphql';

const {
  NODE_ENV,
  SENTRY_DSN_API,
  PORT = '8082',
} = process.env;

connectToDatabase();

const app = express();
app.enable('trust proxy');

Sentry.init({
  dsn: SENTRY_DSN_API,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  // We recommend adjusting this value in production, or using tracesSampler for finer control
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler()); // The request handler must be the first middleware on the app
app.use(Sentry.Handlers.tracingHandler());

if (NODE_ENV === 'development') {
  app.use(cors());
} else {
  app.use(cors({ origin: /\.dmitry-salnikov\.info$/ }));
}

if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

app.get('/', (req:Request, res:Response) => {
  res.send('Status: running');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use('/graphql', graphqlServer);

app.use('/v1', apiV1Router);

// The error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use((error:Error, req:Request, res:Response, next) => {
  if (error.message) {
    console.error('Caught error: ', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  } else {
    next();
  }
});

const port:number = global.parseInt(PORT, 10);
app.listen(port, () => {
  global.console.info(`Server started on port:${port}`);
});
