import bcrypt from 'bcryptjs';
import db from '../db';

// compares user password and hash in database
export const comparePass = (userPassword, databasePassword) =>
  bcrypt.compareSync(userPassword, databasePassword);

export const createUser = req => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return db('users')
    .insert({
      username: req.body.username,
      password: hash,
    })
    .returning('*');
};
