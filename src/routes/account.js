/* @flow */

// import URL from 'url';
import passport from 'passport';
// import validator from 'validator';
import { Router } from 'express';
import { createUser, loginRequired } from '../helpers/auth';

const router = new Router();

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
          // res.redirect('/');
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
        // res.redirect('/');
      });
    }
  })(req, res, next);
});

router.get('/auth/logout', loginRequired, (req, res) => {
  req.session.destroy();
  handleResponse(res, 200, 'success');
  // res.redirect('/');
});

// Allows to fetch the last login error(s) (which is usefull for single-page apps)
router.post('/login/error', (req, res) => {
  res.send({
    errors: req.flash('error'),
  });
});

// Next 3 Routes Are For Testing Authentication
router.get('/', (req, res) => {
  res.render('pages/index', {
    user: req.user,
  });
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/signup', (req, res) => {
  res.render('pages/signup');
});

export default router;
