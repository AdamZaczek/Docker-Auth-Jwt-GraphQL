import bcrypt from 'bcryptjs';
import db from '../db';

/**
 * compares user password and hash in database
 * @param {string} userPassword typed password - The title of the book.
 * @param {string} databasePassword - password hash stored in the database.
 */
export const comparePass = (userPassword, databasePassword) => {
  console.log(userPassword, databasePassword);
  return bcrypt.compareSync(userPassword, databasePassword);
};

export const createUser = req => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return db('users')
    .insert({
      username: req.body.username,
      password_hash: hash,
    })
    .returning('*');
};
