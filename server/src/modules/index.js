import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

const connectDb = () => {
  if (process.env.TEST_DATABASE_URL) {
    return mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
    });
  } else if (process.env.DATABASE_URL) {
    return mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
    });
  }
};

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

import UserModule from './user';
import MenuModule from './menu';

const resolvers = [];
resolvers.push(UserModule.resolver);
resolvers.push(MenuModule.resolver);

const schema = [linkSchema];
schema.push(UserModule.schema);
schema.push(MenuModule.schema);

const User = UserModule.model;
const Menu = MenuModule.model;
const models = { User, Menu };

export { resolvers, schema, models, connectDb };
