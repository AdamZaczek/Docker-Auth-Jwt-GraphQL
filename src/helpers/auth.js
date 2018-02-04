// @flow

import bcrypt from 'bcryptjs';
import db from '../db';
import { decodeToken } from './jwtHelpers';

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

export const comparePass = (userPassword: string, databasePassword: string) => {
  const bool = bcrypt.compareSync(userPassword, databasePassword);
  if (!bool) throw new Error('password does not match');
  else return true;
};

export const ensureAuthenticated = (req, res, next) => {
  console.log(req);
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      status: 'Please log in',
    });
  }
  // decode the token, this is gonna give us ['beader', 'token']
  const header = req.headers.authorization.split(' ');
  const token = header[1];
  decodeToken(token, (err, payload) => {
    if (err) {
      return res.status(401).json({
        status: 'Token has expired',
      });
    }
    // check if the user still exists in the db
    return db('users')
      .where({
        id: parseInt(payload.sub),
      })
      .first()
      .then(user => {
        next();
      })
      .catch(err => {
        res.status(500).json({
          status: 'error',
        });
      });
  });
};
