/* @flow */
/* eslint-disable global-require */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { assignType, getType } from '../utils';

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case 'User':
        return context.userById.load(id).then(assignType('User'));
      default:
        return null;
    }
  },
  obj => {
    switch (getType(obj)) {
      case 'User':
        return require('./UserType').default;
      default:
        return null;
    }
  },
);

export { nodeInterface, node, nodes };
