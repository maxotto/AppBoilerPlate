import jwt from 'jsonwebtoken';
import { combineResolvers, skip } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

// контроль доступа
import {ac, canListUsers} from '../accessControl';

import { isAdmin, isAuthenticated, isGuest } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: combineResolvers(
        isAuthenticated,
        (parent, args, context) => {
          // console.log(context);
          const me = context.me;
          if (me) {
            const role = me.role;
            const permission = ac.can(role).readOwn('video');
            if (permission.granted){
              return skip
            } else return new ForbiddenError('Not permitted for ' + role);
          } else {
            return new ForbiddenError('User is not authenticated.')
          }
        },
        async (parent, args, { models }) => {
          return await models.User.find();
        }),
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findById(me.id);
    },
  },

    Mutation: {
    logout: async (
        parent,
        { username},
        { models, secret },
    ) => {
      const user = await models.User.logout(username);
      if (!user) {
        throw new UserInputError(
            'No user to logout.',
        );
      }
      return true;
    },

    signIn: combineResolvers(
        isGuest,
        async (
      parent,
      { login, password, ldapInfo },
      { models, secret },
    ) => {
        const user = await models.User.findOrCreateByLogin(login, ldapInfo);
        if (!user) {
          throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      return {
        token: createToken(user, secret, '24h'),
        user: user,
      };
    }),

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { models, me }) => {
        return await models.User.findByIdAndUpdate(
          me.id,
          { username },
          { new: true },
        );
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const user = await models.User.findById(id);

        if (user) {
          await user.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },
};
