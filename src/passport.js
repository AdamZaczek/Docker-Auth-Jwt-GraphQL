/* @flow */
/* eslint-disable no-param-reassign, no-underscore-dangle, max-len */
/* to do - make new folder for passport strategies */

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import db from './db';
import { comparePass } from './helpers/auth';

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    username: user.name,
    imageUrl: user.imageUrl,
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creates or updates the external login credentials
// and returns the currently authenticated user.
async function login(req, provider, profile, tokens) {
  let user;

  if (req.user) {
    user = await db
      .table('users')
      .where('id', '=', req.user.id)
      .first();
  }

  if (!user) {
    user = await db
      .table('logins')
      .innerJoin('users', 'users.id', 'logins.user_id')
      .where({
        'logins.provider': provider,
        'logins.id': profile.id,
      })
      .first('users.*');
    if (
      !user &&
      profile.emails &&
      profile.emails.length &&
      profile.emails[0].verified === true
    ) {
      user = await db
        .table('users')
        .innerJoin('emails', 'emails.user_id', 'users.id')
        .where({
          'emails.email': profile.emails[0].value,
          'emails.verified': true,
        })
        .first('users.*');
    }
  }

  if (!user) {
    // eslint-disable-next-line prefer-destructuring
    user = (await db
      .table('users')
      .insert({
        username: profile.displayName,
        image_url:
          profile.photos && profile.photos.length
            ? profile.photos[0].value
            : null,
      })
      .returning('*'))[0];

    if (profile.emails && profile.emails.length) {
      await db.table('emails').insert(
        profile.emails.map(x => ({
          user_id: user.id,
          email: x.value,
          verified: x.verified || false,
        })),
      );
    }
  }

  const loginKeys = {
    user_id: user.id,
    provider,
    id: profile.id,
  };
  const { count } = await db
    .table('logins')
    .where(loginKeys)
    .count('id')
    .first();

  if (count === '0') {
    await db.table('logins').insert({
      ...loginKeys,
      username: profile.username,
      tokens: JSON.stringify(tokens),
      profile: JSON.stringify(profile._json),
    });
  } else {
    await db
      .table('logins')
      .where(loginKeys)
      .update({
        username: profile.username,
        tokens: JSON.stringify(tokens),
        profile: JSON.stringify(profile._json),
        updated_at: db.raw('CURRENT_TIMESTAMP'),
      });
  }

  return {
    id: user.id,
    displayName: user.display_name,
    imageUrl: user.image_url,
  };
}

const LocalStrategy = require('passport-local').Strategy;

const options = {};

passport.use(
  new LocalStrategy(options, (username, password, done) => {
    db('users')
      .where({
        username,
      })
      .first()
      .then(user => {
        if (!user) return done(null, false);
        if (!comparePass(password, user.password_hash)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(err => done(err));
  }),
);

// https://github.com/jaredhanson/passport-facebook
// https://developers.facebook.com/docs/facebook-login/permissions/
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      profileFields: [
        'id',
        'cover',
        'name',
        'age_range',
        'link',
        'gender',
        'locale',
        'picture',
        'timezone',
        'updated_time',
        'verified',
        'email',
      ],
      callbackURL: '/login/facebook/return',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (profile.emails.length)
          profile.emails[0].verified = !!profile._json.verified;
        profile.displayName =
          profile.displayName ||
          `${profile.name.givenName} ${profile.name.familyName}`;
        const user = await login(req, 'facebook', profile, {
          accessToken,
          refreshToken,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

export default passport;
