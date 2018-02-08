// @flow

import bcrypt from 'bcryptjs';
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
  if (!req.user)
    return res.status(401).json({
      status: 'Please log in',
    });
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
