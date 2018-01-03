/* @flow */

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

import StoryType from './StoryType';
import UserType from './UserType';
import type Context from '../Context';

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

    story: {
      type: new GraphQLNonNull(StoryType),
      resolve(parent, args, { storyById }: Context) {
        return storyById.load(parent.story_id);
      },
    },

    parent: {
      type: CommentType,
      resolve(parent, args, { commentById }: Context) {
        return parent.parent_id && commentById.load(parent.parent_id);
      },
    },

    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent, args, { userById }: Context) {
        return userById.load(parent.author_id);
      },
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, { commentsByParentId }: Context) {
        return commentsByParentId.load(parent.id);
      },
    },

    text: {
      type: GraphQLString,
    },

    pointsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent, args, { commentPointsCount }: Context) {
        return commentPointsCount.load(parent.id);
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
  }),
});

export default CommentType;
