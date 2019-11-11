// чтобы таскать настройки из .env
import 'dotenv/config';
// TODO чтобы работал CORS. Надо настраивать для боевого примененния!
import cors from 'cors';
//логгирование
import morgan from 'morgan';
//Сервер
import http from 'http';
//Токены JWT
import jwt from 'jsonwebtoken';

// Вспомогательная библиотека для работы с данными
import DataLoader from 'dataloader';
// чтобы видеть данные запросов
import bodyParser from 'body-parser';
// Express
import express from 'express';
// сессии
import session from 'express-session'
//уникальные ИД
import uuid from 'uuid/v4'
// Преднастроенный Passport
import passport from './passport'
// конфиги
import config from './config';
//Apollo server
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import { resolvers, schema, models, connectDb } from './modules';

// const RedisStore = require('connect-redis')(session);
const MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
    uri: process.env.DATABASE_URL,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.log(error);
});

const app = express();

app.use(bodyParser.json()); //чтобы в req появились данные запроса

app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(cors());

app.use(morgan('dev'));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

const getMe = async req => {
  const token = req.headers['x-token'];
  const guest = {
    id: null,
    username: 'guest',
    role: 'GUEST',
    iat: 0,
    exp: 0
  };
  if (token) {
    try {
      return await jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (e) {
      return guest
    }
  } else {
      return guest
  }
};

app.use('/graphql', (req, res, next) => {
  // при запросе на логин надо подключать passport
  // это единственное место, где мы так перехватываем и разбираем внутренности graphql запроса.
  // Права на остальное мы проверяем в соответствующих resolvers, через isGuest || is Authenticated и т.п.
  if(req.body.operationName && req.body.operationName === 'signIn'){
    req.body.username = req.body.variables.email;
    req.body.password = req.body.variables.password;
    passport.authenticate('ldapauth', {session: true}, function(err, ldapUserInfo, ldapResponce) {
      if(err){
        req.logout();
        const resp = {
          errors: [
            {
              message: 'An error while usin LDAP'
            }
          ]
        };
        res.send(resp)
      } else if(!ldapUserInfo){
        req.logout();
        const resp = {
          errors: [
            {
              message: ldapResponce.message
            }
          ]
        };
        res.send(resp)
      } else {
          // все хорошо, заполняем данные для локального хранения
        req.body.variables.ldapInfo = {
          fullName: ldapUserInfo.cn,
          title: ldapUserInfo.title,
          phone: ldapUserInfo.telephoneNumber,
          lastName: ldapUserInfo.sn,
          email: ldapUserInfo.userPrincipalName
        };
        req.login(ldapUserInfo, function(err) {
          if (err) { return next(err); }
          return next();
        });
      }
    })(req, res, next);
  } else {
    return next()
  }
});

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }

    if (req) {
      let me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.TOKEN_SECRET,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
  },
});

server.applyMiddleware({app, path: '/graphql'});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 4000;

connectDb().then(async () => {
  if (isTest) {
    await Promise.all([models.User.deleteMany({})]);
  } else {
    console.log('DEV server!');
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});
