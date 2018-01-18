/* @flow */
/* eslint-disable no-param-reassign, no-underscore-dangle, max-len */

// import passport from 'passport';
// import db from './db';
// import { comparePass } from './helpers/auth';

// passport.serializeUser((user, done) => {
//   done(null, {
//     id: user.id,
//     username: user.name,
//   });
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// const LocalStrategy = require('passport-local').Strategy;

// const options = {};

// passport.use(
//   new LocalStrategy(options, (username, password, done) => {
//     db('users')
//       .where({
//         username,
//       })
//       .first()
//       .then(user => {
//         if (!user) return done(null, false);
//         if (!comparePass(password, user.password_hash)) {
//           return done(null, false);
//         }
//         return done(null, user);
//       })
//       .catch(err => done(err));
//   }),
// );

// export default passport;
