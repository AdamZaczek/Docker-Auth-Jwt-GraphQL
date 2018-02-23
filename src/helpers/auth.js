// @flow

import bcrypt from 'bcryptjs';

import { handleResponse } from './handleResponse';
import db from '../db';

export const createUser = (req: any) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return db('users')
    .insert({
      username: req.body.username,
      password_hash: hash,
    })
    .returning('*');
};

export const loginRequired = (req: any, res: any, next: any) => {
  if (!req.user) return handleResponse(res, 401, 'Please log in');

  return next();
};

// todo make it use email
export const getUser = (username: string) =>
  db('users')
    .where({
      username,
    })
    .first();

/**
 * compares user password and hash in database
 * @param {string} userPassword typed password - The title of the book.
 * @param {string} databasePassword - password hash stored in the database.
 */
export const comparePass = (userPassword: string, databasePassword: string) => {
  const bool = bcrypt.compareSync(userPassword, databasePassword);
  if (!bool) throw new Error('password does not match');
  else return true;
};
