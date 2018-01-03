/* eslint-disable no-restricted-syntax, no-await-in-loop */

const faker = require('faker');
const bcrypt = require('bcryptjs');

module.exports.seed = async db => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync('noskateboarding', salt);
  const usersAry = [
    {
      username: 'Rodney Mullen',
      // noskateboarding hashed
      password_hash: hash,
    },
    {
      username: 'Bob Burnquist',
      // noskateboarding hashed
      password_hash: hash,
    },
  ];

  await Promise.all(
    usersAry.map(user =>
      db
        .table('users')
        .insert(user)
        .returning('id')
        .then(rows =>
          db
            .table('users')
            .where('id', '=', rows[0])
            .first()
            .then(u =>
              db
                .table('emails')
                .insert({
                  user_id: u.id,
                  email: faker.internet.email().toLowerCase(),
                })
                .then(() => u),
            ),
        )
        .then(row => Object.assign(user, row)),
    ),
  );
};
