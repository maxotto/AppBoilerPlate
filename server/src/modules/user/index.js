import loader from './loader';
import model from './model';
import resolver from './resolver';
import schema from './schema';
import { gql } from 'apollo-server-express';

export default {
  loader: loader,
  model: model,
  resolver: resolver,
  schema: schema,
};
