/* @flow */

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import {
  globalIdField
} from 'graphql-relay';
import {
  nodeInterface
} from './Node';

import CommentType from './CommentType';
import UserType from './UserType';
import type Context from '../Context';

export default new GraphQLObjectType({
  name: 'Story',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent, args, {
        userById
      }: Context) {
        return userById.load(parent.author_id);
      },
    },

    title: {
      type: new GraphQLNonNull(GraphQLString),
    },

    url: {
      type: GraphQLString,
    },

    text: {
      type: GraphQLString,
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, {
        commentsByStoryId
      }: Context) {
        return commentsByStoryId.load(parent.id);
      },
    },

    pointsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent, args, {
        storyPointsCount
      }: Context) {
        return storyPointsCount.load(parent.id);
      },
    },

    commentsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent, args, {
        storyCommentsCount
      }: Context) {
        return storyCommentsCount.load(parent.id);
      },
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.created_at;
      },
    },

    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  },
});
