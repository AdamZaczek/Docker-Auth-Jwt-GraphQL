/* @flow */

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import {
  globalIdField
} from 'graphql-relay';
import {
  nodeInterface
} from './Node';

export default new GraphQLObjectType({
  name: 'Email',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    email: {
      type: new GraphQLNonNull(GraphQLString),
    },

    verified: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },

    primary: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});
