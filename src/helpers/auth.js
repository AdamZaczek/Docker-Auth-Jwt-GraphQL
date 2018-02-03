// @flow

import bcrypt from 'bcryptjs';
import db from '../db';

/**
 * compares user password and hash in database
 * @param {string} userPassword typed password - The title of the book.
 * @param {string} databasePassword - password hash stored in the database.
 */
// export const comparePass = (userPassword: string, databasePassword: string) =>
//   bcrypt.compareSync(userPassword, databasePassword);

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

// export const comparePass = (userPassword: string, databasePassword: string) => {
//   // console.log('yay from comparePass', bcrypt)
//   // console.log(bcrypt.compareSync(userPassword, databasePassword))
//   const bool = bcrypt.compareSync(userPassword, databasePassword);
//   // console.log(bool);
//   bool.then(res => console.log(res))
//   if (!bool) throw new Error('password does not match');
//   else return true;
// };

export const comparePass = (userPassword: string, databasePassword: string) =>
  bcrypt.compareSync(userPassword, databasePassword);
