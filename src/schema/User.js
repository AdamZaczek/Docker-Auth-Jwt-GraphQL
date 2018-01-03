/* @flow */
/* eslint-disable import/prefer-default-export */

import UserType from './UserType';
import type Context from '../Context';

export const me = {
  type: UserType,
  resolve(root: any, args: any, { user, userById }: Context) {
    return user && userById.load(user.id);
  },
};
