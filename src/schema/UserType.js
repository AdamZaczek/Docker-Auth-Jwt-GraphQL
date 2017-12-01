/* @flow */

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} from 'graphql';
import {
  globalIdField
} from 'graphql-relay';

import EmailType from './EmailType';
import {
  nodeInterface
} from './Node';
import type Context from '../Context';

export default new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    displayName: {
      type: GraphQLString,
      resolve(parent) {
        return parent.display_name;
      },
    },

    imageUrl: {
      type: GraphQLString,
      resolve(parent) {
        return parent.image_url;
      },
    },

    emails: {
      type: new GraphQLList(EmailType),
      resolve(parent, args, {
        user,
        emailsByUserId
      }: Context) {
        return parent.id === user.id ? emailsByUserId.load(parent.id) : null;
      },
    },
  },
});
