/* @flow */

// import URL from 'url';
import passport from 'passport';
// import validator from 'validator';
import { Router } from 'express';
import { createUser, loginRequired } from '../helpers/auth';

const router = new Router();

// commenting for now, might prove usefull

// '/about' => ''
// http://localhost:3000/some/page => http://localhost:3000
// function getOrigin(url: string) {
//   if (!url || url.startsWith('/')) return '';
//   return (x => `${String(x.protocol)}//${String(x.host)}`)(URL.parse(url));
// }

// '/about' => `true` (all relative URL paths are allowed)
// 'http://localhost:3000/about' => `true` (but only if its origin is whitelisted)
// function isValidReturnURL(url: string) {
//   if (url.startsWith('/')) return true;
//   const whitelist = process.env.CORS_ORIGIN
//     ? process.env.CORS_ORIGIN.split(',')
//     : [];
//   return (
//     validator.isURL(url, {
//       require_tld: false,
//       require_protocol: true,
//       protocols: ['http', 'https'],
//     }) && whitelist.includes(getOrigin(url))
//   );
// }

// Generates a URL for redirecting a user to upon successfull authentication.
// It is intended to support cross-domain authentication in development mode.
// For example, a user goes to http://localhost:3000/login (frontend) to sign in,
// then he's being redirected to http://localhost:8080/login/facebook (backend),
// Passport.js redirects the user to Facebook, which redirects the user back to
// http://localhost:8080/login/facebook/return and finally, user is being redirected
// to http://localhost:3000/?sessionID=xxx where front-end middleware can save that
// session ID into cookie (res.cookie.sid = req.query.sessionID).

// function getSuccessRedirect(req) {
//   const url = req.query.return || req.body.return || '/';
//   if (!isValidReturnURL(url)) return '/';
//   if (!getOrigin(url)) return url;
//   return `${url}${url.includes('?') ? '&' : '?'}sessionID=${req.cookies.sid}${
//     req.session.cookie.originalMaxAge
//       ? `&maxAge=${req.session.cookie.originalMaxAge}`
//       : ''
//   }`;
// }

/* in progress */

function handleResponse(res, code, statusMsg) {
  res.status(code).json({
    status: statusMsg,
  });
}

router.post('/auth/register', (req, res, next) =>
  createUser(req)
    .then(() => {
      passport.authenticate('local', (err, user) => {
        if (user) {
          handleResponse(res, 200, 'success');
        }
      })(req, res, next);
    })
    .catch(err => handleResponse(err, 500, 'error')),
);

router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      handleResponse(res, 500, 'error');
    }
    if (!user) {
      handleResponse(res, 404, 'User not found');
    }
    if (user) {
      req.logIn(user, error => {
        if (error) {
          handleResponse(res, 500, 'error');
        }
        handleResponse(res, 200, 'success');
      });
    }
  })(req, res, next);
});

router.get('/auth/logout', loginRequired, (req, res) => {
  req.session.destroy();
  handleResponse(res, 200, 'success');
});

// Allows to fetch the last login error(s) (which is usefull for single-page apps)
router.post('/login/error', (req, res) => {
  res.send({
    errors: req.flash('error'),
  });
});

// Next 3 Routes Are For Testing Authentication
router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/signup', (req, res) => {
  res.render('pages/signup');
});

export default router;
